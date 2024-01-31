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
  environment {
        GOOGLE_CLOUD_KEY_FILE = credentials('sa-gcr-image')
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

    stage('bulid image') {
      steps {
        container('docker') {
          script {
            sh "docker build . -t sample-react:latest"
          }
        }
      }
    }

    stage("Tagging  Image") {
      steps {
        container('docker') {
          script {
            sh "docker tag sample-react:latest gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
          }
        }
      }
    }

    stage("Pushing GCR Image") {
      steps {
        container('docker') {
          script {
             withCredentials([file(credentialsId: 'sa-gcr-image', variable: 'GOOGLE_CLOUD_KEY_FILE')]) {
              sh "gcloud auth activate-service-account --key-file=${GOOGLE_CLOUD_KEY_FILE}" {
              sh "docker push gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
            }
          }
        }
      }
    }
  }
}



