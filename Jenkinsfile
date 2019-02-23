pipeline {
  agent any

  stages {
    stage ('Experimenting') {
      steps {
        echo "Build number: ${env.BUILD_ID}, Job name: ${env.JOB_NAME}"
      }
    }
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
        // ref: https://jincod.github.io/2017/09/04/jenkins-integration-with-jest/
        withEnv(["JEST_JUNIT_OUTPUT=./jest-test-results.xml"]) {
          sh 'npm run test:unit'
        }
        junit 'jest-test-results.xml'
      }
    }
    stage ('Do something else') {
      steps {
        echo "The below will succeed"
        sh 'node scripts/nodeexit0.js'
        echo "The below will fail"
        sh 'node scripts nodeexit1.js'
      }
    }
    stage('Deploy') {
      when {
        expression {
          currentBuild.result == null || currentBuild.result == 'SUCCESS' 
        }
      }
      steps {
        echo 'Deploying, but where...?'
        sleep time: 10, unit: 'MINUTES'
      }
    }
  }
}