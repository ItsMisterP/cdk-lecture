pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        CDK_DEFAULT_ACCOUNT = 'YOUR_AWS_ACCOUNT_ID'
        CDK_DEFAULT_REGION = 'us-east-1'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build CDK App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy CDK') {
            steps {
                withCredentials([string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                                 string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh 'cdk deploy --require-approval never'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment erfolgreich abgeschlossen!'
        }
        failure {
            echo 'Deployment fehlgeschlagen.'
        }
    }
}
