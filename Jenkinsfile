pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        echo 'Installing dependencies...'
        sh 'npm i'
        echo 'Building...'
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        echo 'Running tests'
        sh 'npm run test:unit'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying, but where...?'
        sleep time: 10, unit: 'MINUTES'
      }
    }
  }
}