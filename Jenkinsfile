node {

    String BRANCH_PLATFORM = ""

    stage ('Checkout') {
        // Checkout code for the pushed branch
        checkout scm

        // Get the name of the Platform that was committed to (i.e. master, server, ios, android, etc.)
        BRANCH_PLATFORM = sh(script: '''#!/bin/bash
            gitHead=$(git describe --contains --all HEAD)
            newVar=${gitHead#*/}
            newerVar=${newVar#*/}
            finalVar=${newerVar%%/*}
            echo $finalVar
        ''', returnStdout: true).trim()

        println BRANCH_PLATFORM
    }

    stage ('Build') {
        if (BRANCH_PLATFORM == "master" || BRANCH_PLATFORM == "server") {
            //sh "docker build -t hello-world ./src/Nodejs"

            sh "./src/Nodejs/docker-compose build"
        }
    }

    stage ('Publish') {
        if (BRANCH_PLATFORM == "master" || BRANCH_PLATFORM == "server") {
            sh '''#!/bin/bash
                $(aws ecr get-login --region us-west-1)
            '''

            docker.withRegistry('https://607258079075.dkr.ecr.us-west-1.amazonaws.com/hello-world', 'ecr:us-west-1:demo-credentials') {
                docker.image('hello-world').push('v_${BUILD_NUMBER}')
                docker.image('hello-world').push('latest')

                docker.image('mongo').push('v_${BUILD_NUMBER}')
                docker.image('mongo').push('latest')

                docker.image('mongodata').push('v_${BUILD_NUMBER}')
                docker.image('mongodata').push('latest')
            }
        }
    }

    stage ('Deploy to Staging') {
        if (BRANCH_PLATFORM == "master" || BRANCH_PLATFORM == "server") {

            // Create New Task Definition and Create or Update ECS Service
            sh '''#!/bin/bash
                REGION=us-west-1
                REPOSITORY_NAME=hello-world
                CLUSTER=getting-started
                FAMILY=newnew
                NAME=newtaskdefcontainer
                SERVICE_NAME=${NAME}-service

                #Store the repositoryUri as a variable
                REPOSITORY_URI=`aws ecr describe-repositories --repository-names ${REPOSITORY_NAME} --region ${REGION} | jq .repositories[].repositoryUri | tr -d '"'`
                echo $REPOSITORY_URI

                #Replace the build number and respository URI placeholders with the constants above
                sed -e "s;%BUILD_NUMBER%;${BUILD_NUMBER};g" -e "s;%REPOSITORY_URI%;${REPOSITORY_URI};g" src/Config/taskdef.json > ${NAME}-v_${BUILD_NUMBER}.json

                #Register the task definition in the repository
                aws ecs register-task-definition --family ${FAMILY} --cli-input-json file://${WORKSPACE}/${NAME}-v_${BUILD_NUMBER}.json --region ${REGION}

                SERVICES=`aws ecs describe-services --services ${SERVICE_NAME} --cluster ${CLUSTER} --region ${REGION} | jq .failures[]`

                #Get latest revision
                REVISION=`aws ecs describe-task-definition --task-definition ${FAMILY} --region ${REGION} | jq .taskDefinition.revision`

                #Create or update service
                if [ "$SERVICES" == "" ]; then
                    echo "Existing Service"
                    DESIRED_COUNT=`aws ecs describe-services --services ${SERVICE_NAME} --cluster ${CLUSTER} --region ${REGION} | jq .services[].desiredCount`
                if [ ${DESIRED_COUNT} = "0" ]; then
                    DESIRED_COUNT="1"
                fi

                aws ecs update-service --cluster ${CLUSTER} --region ${REGION} --service ${SERVICE_NAME} --task-definition ${FAMILY}:${REVISION} --desired-count ${DESIRED_COUNT}

                else
                    echo "New Service"
                    aws ecs create-service --service-name ${SERVICE_NAME} --desired-count 1 --task-definition ${FAMILY} --cluster ${CLUSTER} --region ${REGION}
                fi
            '''
        }
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