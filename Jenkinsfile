pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: gcloud
            image: gcr.io/cloud-builders/gcloud
            command:
            - cat
            tty: true
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
        GOOGLE_CLOUD_KEY_FILE_ID = credentials('sa-test')
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
        container('gcloud') {
          script {
            sh "gcloud config list"
            sh "gcloud auth configure-docker -y"
            //  withCredentials([file(credentialsId: 'sa-test', variable: 'GOOGLE_CLOUD_KEY_FILE_ID')]) {
            //   sh "gcloud auth activate-service-account --key-file=${GOOGLE_CLOUD_KEY_FILE_ID}"
            //   sh "gcloud config set project ${params.GCP_PROJECT_ID}"  
            // }
          }
        }

        container('docker') {
            script {
                sh "docker push gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
            }

        }
      }
    }
  }
}



 