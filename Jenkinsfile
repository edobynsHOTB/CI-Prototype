node {

    String BRANCH_PLATFORM = ""

    stage ('Checkout') {
        // Checkout code for the pushed branch
        checkout scm
    }

    stage ('Build') {
        sh "docker build -t hello-world ./src/Nodejs"
    }

    stage ('Publish') {
        sh '''#!/bin/bash
            $(aws ecr get-login --region us-west-1)
        '''

        docker.withRegistry('https://607258079075.dkr.ecr.us-west-1.amazonaws.com/hello-world', 'ecr:us-west-1:demo-credentials') {
            docker.image('hello-world').push('v_${BUILD_NUMBER}')
            docker.image('hello-world').push('latest')
        }
    }

    stage ('Deploy to Staging') {
        // Create New Task Definition and Create or Update ECS Service
        sh '''#!/bin/bash

        JQ="jq --raw-output"

        ECS_REGION=us-west-1
        ECR_REPOSITORY_NAME=hello-world
        ECS_CLUSTER=us-west-1
        ECS_SERVICE=newServiceTitle-service
        ECS_FAMILY=newnew
        ECS_TASK_DEFINITION=newServiceTitle




        ####
        # Functions
        ####
            function get_ecs_status() {
                echo "GET ECS STATUS -"
                DECRIBED_SERVICE=$(aws ecs describe-services --cluster $ECS_CLUSTER \
                                                            --services $ECS_SERVICE);

                CURRENT_DESIRED_COUNT=$(echo $DECRIBED_SERVICE | $JQ ".services[0].desiredCount")
                CURRENT_TASK_REVISION=$(echo $DECRIBED_SERVICE | $JQ ".services[0].taskDefinition")
                CURRENT_RUNNING_TASK=$(echo $DECRIBED_SERVICE | $JQ ".services[0].runningCount")
                CURRENT_STALE_TASK=$(echo $DECRIBED_SERVICE | $JQ ".services[0].deployments | .[] | select(.taskDefinition != \"$CURRENT_TASK_REVISION\") | .taskDefinition")
                if [[ -z "$CURRENT_STALE_TASK" ]]; then
                    CURRENT_STALE_TASK=0
                fi
            }


            function update_ecs_service() {
                echo "UPDATE ECS SERVICE -"
                output=$(aws ecs update-service --cluster $ECS_CLUSTER \
                                                --service $ECS_SERVICE \
                                                --task-definition $1 \
                                                --desired-count $2)

                if [[ $(echo $output | $JQ '.service.taskDefinition') != $1  ]] || [[ $(echo $output | $JQ '.service.desiredCount') != $2  ]];  then
                    echo -e "\n$(date "+%Y-%m-%d %H:%M:%S") Error, in setting service"
                    exit 2
                fi
            }

            function update_ecs_task_def() {
                echo "UPDATE ECS TASK DEF -"
                if CURRENT_TASK_REVISION=$(aws ecs register-task-definition --container-definitions "$1" \
                                                                            --family $ECS_FAMILY  \
                                                                            | $JQ '.taskDefinition.taskDefinitionArn'); then
                    echo -e "\n$(date "+%Y-%m-%d %H:%M:%S") Successfully register task definition :\n\tfamily : $ECS_FAMILY\n\tRevision : $CURRENT_TASK_REVISION\n"
                    return 0
                fi

                echo -e "\n$(date "+%Y-%m-%d %H:%M:%S") Failed to register task definition :\n\tfamily : $ECS_FAMILY"
                exit 1
            }

            function wait_ecs_nb_task() {
                for attempt in {1..120}; do
                    get_ecs_status
                if [ $CURRENT_RUNNING_TASK -ne $CURRENT_DESIRED_COUNT ]; then
                    sleep 1
                else
                    return 0
                fi
                done

                echo -e "\n\n$(date "+%Y-%m-%d %H:%M:%S") Waiting for running count to reach $CURRENT_DESIRED_COUNT took to long. Current running task : $CURRENT_RUNNING_TASK\n\n"
                exit 3
            }

            function wait_ecs_no_stale_task() {
                for attempt in {1..240}; do
                    get_ecs_status;
                echo "$(date "+%Y-%m-%d %H:%M:%S") Running : $CURRENT_RUNNING_TASK, Desired : $CURRENT_DESIRED_COUNT, Stale : $CURRENT_STALE_TASK"

                if [[ $CURRENT_STALE_TASK>0 ]]; then
                    sleep 2
                else
                    return 0
                fi
                done
                
                echo "\n\nService update took too long.\n\n"
                exit 4
            }

            ##################


            get_ecs_status;
            DESIRED_COUNT=$CURRENT_DESIRED_COUNT

            if [[ $DESIRED_COUNT>0 ]]; then
                echo "$(date "+%Y-%m-%d %H:%M:%S") Decrease the desired numberof running task instances by one ($DESIRED_COUNT - 1 =$(expr $DESIRED_COUNT - 1))"
                echo "Otherwise, the deploy will fail if cluster is not able to support one additional instance (We assume this is not the case)."
                
                update_ecs_service $CURRENT_TASK_REVISION $(expr $DESIRED_COUNT - 1)
            else
                echo -e "$(date "+%Y-%m-%d %H:%M:%S") Service has currently 0 desired running instances. Setting the desired running task instance to 1"
                DESIRED_COUNT=1
            fi

            
            echo "$(date "+%Y-%m-%d %H:%M:%S") Update the Task definition (Includes the new docker images to use)"
            revision=$(update_ecs_task_def "$ECS_TASK_DEFINITION")

            echo "$(date "+%Y-%m-%d %H:%M:%S") Update the service to use the newly created task revision ($CURRENT_TASK_REVISION)"
            update_ecs_service "$CURRENT_TASK_REVISION" "$(expr $DESIRED_COUNT - 1)"

            echo "$(date "+%Y-%m-%d %H:%M:%S") Waiting for the number of running task instance to decrease to $(expr $DESIRED_COUNT - 1)"
            wait_ecs_nb_task $(expr $DESIRED_COUNT - 1)

            echo "$(date "+%Y-%m-%d %H:%M:%S") Done ... Now we can now re-set the original desired number task instance ($DESIRED_COUNT)"
            update_ecs_service "$CURRENT_TASK_REVISION" "$DESIRED_COUNT"

            echo "$(date "+%Y-%m-%d %H:%M:%S") Waiting for the number of running task to reach the original desired number of instances ($DESIRED_COUNT)"
            wait_ecs_nb_task $DESIRED_COUNT

            echo "$(date "+%Y-%m-%d %H:%M:%S") Waiting for stale task to be replaced by their new revision"
            wait_ecs_no_stale_task

            echo "$(date "+%Y-%m-%d %H:%M:%S") Deploy completed successfully. "
            echo "THANK YOU COME AGAIN!"

        '''
    }

    stage ('Test') {
        // Run Tests 
        //sh '''#!/bin/bash
        //python tests/apiTest.py 13.56.3.25:3000
        //'''

        // Tear Down Staging?
    }

    stage ('Deploy to Pre-Production') {

    }
}