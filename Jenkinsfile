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
        withEnv(["JEST_JUNIT_OUTPUT=./jest-test-results.xml"]) {
          sh 'npm run test:unit'
        }
        junit 'jest-test-results.xml'
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