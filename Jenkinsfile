pipeline {
    agent any
    tools {
        maven 'M3_8_2'
    }
    stages {
        stage('Build') {
            steps {
                dir('Curso-Microservicios/'){
                    echo 'Execute Maven'
                    sh 'mvn clean package'
                }
            }
        }
    }
}