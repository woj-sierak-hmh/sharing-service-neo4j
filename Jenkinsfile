pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        echo 'Here we will test'
        sleep time: 10, unit: 'MINUTES'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Here we will deploy'
      }
    }
  }
}