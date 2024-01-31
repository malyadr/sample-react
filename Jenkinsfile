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
            sh "docker tag sample-react:latest eu.gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
          }
        }
      }
    }

    stage("Pushing GCR Image") {
      steps {
        container('docker') {
          script {
            withDockerRegistry([credentialsId: "gcr:sa-gcr-image", url: "https://eu.gcr.io"]) {
               sh "docker push eu.gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
            }
          }
        }

        // container('docker') {
        //     script {
        //         sh "docker push gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"
        //     }

        // }
      }
    }
  }
}

// withDockerRegistry([credentialsId: "gcr:${params.GCP_PROJECT_ID}", url: "https://gcr.io"]) {
//             sh "docker push gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${params.GCR_IMAGE_TAG}"

//  withCredentials([file(credentialsId: "${PROJECT}_artifacts", variable: 'GCR_CRED')]){
//               sh 'cat "${GCR_CRED}" | docker login -u _json_key_base64 --password-stdin https://"${REPO_LOCATION}"-docker.pkg.dev'
//               sh 'docker push ${IMAGE_NAME}:${IMAGE_TAG}'
//               sh 'docker logout https://"${REPO_LOCATION}"-docker.pkg.dev'