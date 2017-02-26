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

        ECS_REGION=us-west-1
        ECR_REPOSITORY_NAME=hello-world
        ECS_CLUSTER=getting-started
        ECS_SERVICE=newServiceTitle-service
        ECS_FAMILY=newnew
        ECS_TASK_DEFINITION=newServiceTitle

        function getECSStatus() {
            DECRIBED_SERVICE=$(aws ecs describe-services --cluster $ECS_CLUSTER \
                                                        --services $ECS_SERVICE \
                                                        --region $ECS_REGION);

            CURRENT_DESIRED_COUNT=$(echo $DECRIBED_SERVICE | jq .services[0].desiredCount)
            CURRENT_TASK_REVISION=$(echo $DECRIBED_SERVICE | jq .services[0].taskDefinition)
            CURRENT_RUNNING_COUNT=$(echo $DECRIBED_SERVICE | jq .services[0].runningCount)
        }

        function updateECSService() {
            output=$(aws ecs update-service --cluster $ECS_CLUSTER \
                                            --service $ECS_SERVICE \
                                            --task-definition $1 \
                                            --desired-count $2 \
                                            --region $ECS_REGION)
        }

        function createECSService() {
            aws ecs create-service --service-name ${ECS_SERVICE} \
                        --desired-count 1 \
                        --task-definition ${ECS_FAMILY} \
                        --cluster ${ECS_CLUSTER} \
                        --region ${ECS_REGION}
        }

        function updateTaskDefinition() {
                #Store the repositoryUri as a variable
                REPOSITORY_URI=$(aws ecr describe-repositories --repository-names ${ECR_REPOSITORY_NAME} --region ${ECS_REGION} | jq .repositories[].repositoryUri | tr -d '"')

                #Replace the build number and respository URI placeholders with the constants above
                sed -e "s;%BUILD_NUMBER%;${BUILD_NUMBER};g" -e "s;%REPOSITORY_URI%;${REPOSITORY_URI};g" src/Config/taskdef.json > ${ECS_TASK_DEFINITION}-v_${BUILD_NUMBER}.json

                #Register the task definition in the repository
                aws ecs register-task-definition --family ${ECS_FAMILY} \
                                                 --cli-input-json file://${WORKSPACE}/${ECS_TASK_DEFINITION}-v_${BUILD_NUMBER}.json \
                                                 --region ${ECS_REGION}
        }        

        function waitForNumberOfRunningTasks() {
            for attempt in {1..120}; do
                getECSStatus
                if [ $CURRENT_RUNNING_COUNT -ne $1 ]; then
                    sleep 1
                else
                    return 0
                fi
            done

            echo -e "\n\n$(date "+%Y-%m-%d %H:%M:%S") Waiting for running count to reach $CURRENT_DESIRED_COUNT took to long. Current running task : $CURRENT_RUNNING_TASK\n\n"
            exit 3
        }



        echo "$(date "+%Y-%m-%d %H:%M:%S")"
        getECSStatus;

        if [[ $CURRENT_DESIRED_COUNT>0 ]]; then
            updateECSService $CURRENT_TASK_REVISION $(expr $CURRENT_DESIRED_COUNT - 1)
        else
            CURRENT_DESIRED_COUNT=1
        fi

        updateTaskDefinition;

        getECSStatus;

        SERVICE_FAILURES=$(aws ecs describe-services --services ${ECS_SERVICE} --cluster ${ECS_CLUSTER} --region ${ECS_REGION} | jq .failures[])

        waitForNumberOfRunningTasks 0

        if [ "$SERVICE_FAILURES" == "" ]; then

            if [[ $CURRENT_DESIRED_COUNT=0 ]]; then
                CURRENT_DESIRED_COUNT=1
            fi

            REVISION_NUMBER=`aws ecs describe-task-definition --task-definition ${ECS_FAMILY} --region ${ECS_REGION} | jq .taskDefinition.revision`

            updateECSService ${ECS_FAMILY}:${REVISION_NUMBER} $CURRENT_DESIRED_COUNT

        else 
            createECSService;
        fi

        waitForNumberOfRunningTasks 1
        echo "FINISHED STARTING NEW TASK... SERVER UP"

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