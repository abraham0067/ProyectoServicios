pipeline {
    agent any
    environment{
        LOCAL_SERVER = "192.168.100.7"
    }
    tools {
        maven 'M3_8_2'
        nodejs 'NodeJs12'
    }
    stages {
        stage('Build and Analize') {
            steps {
                dir('Curso-Microservicios/'){
                    echo 'Execute Maven and Analizing with SonarServer'
                    withSonarQubeEnv('SonarServer') {
                        sh "mvn clean package" 
                        // sh "mvn clean package sonar:sonar"
                        /*
                        sh "mvn clean package dependency-check:check sonar:sonar \
                            -Dsonar.projectKey=21_MyCompany_Microservice \
                            -Dsonar.projectName=21_MyCompany_Microservice \
                            -Dsonar.sources=src/main \
                            
                            -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml"
                            */
                    }
                }
            }
        }
        /*
        stage('Quality Gate'){
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }*/
        stage('Frontend') {
            steps {
                echo 'Building Frontend'
                dir('frontend/'){
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'docker stop frontend-one || true'
                    sh "docker build -t frontend-web ."
                    sh 'docker run -d --rm --name frontend-one -p 8010:80 frontend-web'
                }
            }
        }
        stage('Database') {
            steps {
                dir('liquibase/'){
                    sh '/opt/liquibase/liquibase --version'
                    sh '/opt/liquibase/liquibase --changeLogFile="changesets/db.changelog-master.xml" update'
                    echo 'Applying Db changes'
                }
            }
        }
        stage('Container Build') {
            steps {
                dir('Curso-Microservicios/'){
                    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'dockerhub_id', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                        sh 'docker login -u $USERNAME -p $PASSWORD'
                        sh 'docker build -t microservicio-service .'
                    }
                }
            }
        }
        stage('Container push Nexus') {
            steps {
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'dockernexus_id', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                        sh 'docker login ${LOCAL_SERVER}:8083 -u $USERNAME -p $PASSWORD'
                        sh 'docker tag microservicio-service:latest ${LOCAL_SERVER}:8083/repository/docker-private/microservicio_nexus:dev'
                }
                
            }
        }
        stage('Container Run') {
            steps {
                sh 'docker stop microservicio-one || true'
                //sh 'docker run -d --rm --name microservicio-one  -p 8090:8090 microservicio-service'
                //sh 'docker run -d --rm --name microservicio-one -p 8090:8090 ${LOCAL_SERVER}:8083/repository/docker-private/microservicio_nexus:dev'
                sh 'docker run -d --rm --name microservicio-one -e SPRING_PROFILES_ACTIVE=qa -p 8090:8090 ${LOCAL_SERVER}:8083/repository/docker-private/microservicio_nexus:dev'
                sh 'docker push ${LOCAL_SERVER}:8083/repository/docker-private/microservicio_nexus:dev'
            }
        }
        stage('Testing') {
            steps {
                dir('cypress/') {
                    sh 'docker build -t cypressfront .'
                    sh 'docker run cypressfront'
                    //sh 'docker run --rm --name Cypress -v "C:/Users/Abraham/Documents/INTELLIJ/DIPLOMADO MICROSERVICIOS Y DEVOPS/MI_RAMA/EcosistemaJenkins/jenkins_home/workspace/ProyectoServicios_Dev/Cypress:/e2e" -w /e2e -e Cypress cypress/included:3.4.0'
                }
            }
        }
        /* 
        stage('tar videos') 
        {
            steps 
            {
                dir('cypress/cypress/videos/') {
                    sh 'tar -cvf videos.tar .'
                    archiveArtifacts artifacts: 'videos.tar',
                    allowEmptyArchive: true
                }
            }
        }*/
    }
}