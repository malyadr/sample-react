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
          - name: kubectl
            image: gcr.io/cloud-builders/kubectl
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
                name: 'GKE_CLUSTER_NAME',
                trim: true 
              ), 
              string(
                name: 'GKE_ZONES',
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
            sh "docker tag sample-react:latest gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${env.BUILD_ID}"
          }
        }
      }
    }

    stage("Pushing GCR Image") {
      steps {
        container('docker') {
          script {
            withDockerRegistry([credentialsId: "gcr:sa-gcr-image", url: "https://gcr.io"]) {
               sh "docker push gcr.io/${params.GCP_PROJECT_ID}/${params.GCR_IMAGE_NAME}:${env.BUILD_ID}"
            }
          }
        }

      }
    }

    stage('Deploy to GKE cluster') {
      steps {
         container('kubectl') {
          sh "sed -i 's/tagversion/${env.BUILD_ID}/g' ./deployment/deployment.yaml"
          sh 'pwd'
          sh 'ls'
          step([$class: 'KubernetesEngineBuilder', namespace:'default', projectId: params.GCP_PROJECT_ID, clusterName: params.GKE_CLUSTER_NAME, zone: params.GKE_ZONES, manifestPattern: 'deployment', credentialsId: "sa-gcr-image", verifyDeployments: true])
        }
      }

  }
  
 }
}
