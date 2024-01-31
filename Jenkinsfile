pipeline {
  agent any
  tools {
    dockerTool "docker"
  }
  stages {
    stage('Setup parameters') {
      steps {
        script {
          properties([
            parameters([
              string(
                name: 'GCP_PROJECT_ID',
                trim: true
              ),
              string(
                name: 'GCR_IMAGE_NAME',
                trim: true
              ),
              string(
                name: 'GCR_IMAGE_TAG',
                trim: true
              )
            ])
          ])
        }
      }
    }

    stage('Pulling Image from ECR') {
      steps {
        script {
          sh "docker build . -t samplereact:latest"
        }
      }
    }

    stage("Tagging ECR Image") {
      steps {
        script {
          sh "docker tag samplereact:latest gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
        }
      }
    }

    stage("Pushing ECR Image to GCR") {
      steps {
        script {
          withDockerRegistry([credentialsId: "sa-gcr-image", url: "https://gcr.io"]) {
            sh "docker push gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
          }
        }
      }
    }
  }
}
