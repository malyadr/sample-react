pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: docker
            image: docker:latest
            command:
            - cat
            tty: true
            volumeMounts:
            - mountPath: /var/run/docker.sock
              name: docker-sock
          volumes:
          - name: docker-sock
            hostPath:
              path: /var/run/docker.sock    
        '''
    }
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
        container('docker') {
          script {
            sh "docker pull <your-ecr-repository-url>:latest"
          }
        }
      }
    }

    stage("Tagging ECR Image") {
      steps {
        container('docker') {
          script {
            sh "docker tag <your-ecr-repository-url>:latest gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
          }
        }
      }
    }

    stage("Pushing GCR Image") {
      steps {
        container('docker') {
          script {
            withDockerRegistry([credentialsId: "sa-gcr-image", url: "https://gcr.io"]) {
              sh "docker push gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
            }
          }
        }
      }
    }
  }
}



