
def hostIp(container) {
  sh "docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${container.id} > hostIp"
  readFile('hostIp').trim()
}

node {

  String branchfolder = ""

  stage ('Checkout') {
    checkout scm
  
    branchfolder = sh(script: '''#!/bin/bash
        gitHead=$(git describe --contains --all HEAD)
        newVar=${gitHead#*/}
        newerVar=${newVar#*/}
        finalVar=${newerVar%%/*}
        echo $finalVar
    ''', returnStdout: true).trim()
  }
 
  stage ('Build & Test') {
    docker.build('hello-world')
  }
  
  stage ('Publish') {

    docker.image('hello-world').withRun('-p 3000:3000') {c ->
      sh '''
      URL=${hostIp(c)}
      echo URL
      //python tests/apiTest.py URL
      '''
      //sh "curl ${hostIp(c)}:3000"
      //sh "curl -si http://${hostIp(c)}:3000/ -u edobyns:5b3771addfb503117607c54e443102a3"
      //sh "wget --auth-no-challenge --http-user=edobyns --http-password=5b3771addfb503117607c54e443102a3 --secure-protocol=TLSv1 http://localhost:3000"
    }

    //docker.image('hello-world').withRun {c ->
    //  sh(script: 'tests/shellTest.sh', returnStdout: true).trim()
    //}

    sh '''#!/bin/bash
        $(aws ecr get-login --region us-west-1)
    '''

    docker.withRegistry('https://607258079075.dkr.ecr.us-west-1.amazonaws.com/hello-world', 'ecr:us-west-1:demo-credentials') {
        docker.image('hello-world').push('v_${BUILD_NUMBER}')
        docker.image('hello-world').push('latest')
    }
  }
  
  stage ('Start Service') {
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
        sed -e "s;%BUILD_NUMBER%;${BUILD_NUMBER};g" -e "s;%REPOSITORY_URI%;${REPOSITORY_URI};g" taskdef.json > ${NAME}-v_${BUILD_NUMBER}.json
        echo "Repository URI | Name of File | File path:"
        echo ${REPOSITORY_URI}
        echo ${NAME}-v_${BUILD_NUMBER}
        less file://${WORKSPACE}/${NAME}-v_${BUILD_NUMBER}.json
        echo "---"

        #Register the task definition in the repository
        aws ecs register-task-definition --family ${FAMILY} --cli-input-json file://${WORKSPACE}/${NAME}-v_${BUILD_NUMBER}.json --region ${REGION}
        
        echo "Items for Servies:"
        echo ${SERVICE_NAME}
        echo ${CLUSTER}
        echo "---"
        
        SERVICES=`aws ecs describe-services --services ${SERVICE_NAME} --cluster ${CLUSTER} --region ${REGION} | jq .failures[]`
        echo "Service failures:"
        echo $SERVICES
        echo "---"
        
        #Get latest revision
        REVISION=`aws ecs describe-task-definition --task-definition ${FAMILY} --region ${REGION} | jq .taskDefinition.revision`
        echo "Revision Number:"
        echo $REVISION
        echo "---"
        
        #Create or update service
        if [ "$SERVICES" == "" ]; then
          echo "entered existing service"
          DESIRED_COUNT=`aws ecs describe-services --services ${SERVICE_NAME} --cluster ${CLUSTER} --region ${REGION} | jq .services[].desiredCount`
          if [ ${DESIRED_COUNT} = "0" ]; then
            DESIRED_COUNT="1"
          fi
          echo $DESIRED_COUNT
          aws ecs update-service --cluster ${CLUSTER} --region ${REGION} --service ${SERVICE_NAME} --task-definition ${FAMILY}:${REVISION} --desired-count ${DESIRED_COUNT}
        else
          echo "entered new service"
          aws ecs create-service --service-name ${SERVICE_NAME} --desired-count 1 --task-definition ${FAMILY} --cluster ${CLUSTER} --region ${REGION}
        fi        
        
    '''
  }
}