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
      }
    }
    stage('Deploy') {
      steps {
        echo 'Here we will deploy'
      }
    }
  }
}