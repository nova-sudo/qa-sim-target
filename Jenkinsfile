// Jenkins declarative pipeline for the qa-sim-target Jest suite.
//
// What it does:
//   1. Checks out the repo (Jenkins handles the actual SCM step before
//      this script runs)
//   2. Installs Node deps (cached when the workspace persists)
//   3. Runs Jest with the jest-junit reporter
//   4. Publishes the JUnit XML so the QA Hub can scrape test-level
//      pass/fail counts later — Jenkins' "junit" step indexes the
//      results into its own DB (visible at /job/X/build/Y/testReport)
//      AND makes them available via the api/json `actions[testResult]`
//      field that downstream widgets read.
//
// Environment knobs (set as build parameters or job-level env):
//   - SIMULATE_BROKEN=1   → forces the toggleable test to fail
//   - FLAKY_FAIL_RATE     → 0..1, default 0.2 (the flaky test's prob)
//   - FAST_SUITE=1        → skips the slow test (skip the ~2s sleep)
//
// Agent: `any` because the local Jenkins on Docker is a single-node
// controller with the built-in node. In a real CI setup you'd pin
// `agent { label 'node18' }` or similar.

pipeline {
    agent any

    options {
        // Keep last 20 builds for the QA Hub history widget to scrape.
        // Older ones get evicted, freeing disk on long-lived jobs.
        buildDiscarder(logRotator(numToKeepStr: '20'))
        // Surface the build duration in the build description.
        timestamps()
    }

    environment {
        // Jenkins' default PATH inside the LTS image doesn't include
        // node — we set NODEJS to whatever the controller has on it.
        // The lts-jdk17 image used in our docker-compose includes the
        // Eclipse Temurin JDK but not Node, so for the local demo we
        // install Node into the workspace on first build.
        NODE_VERSION = '20.18.0'
        PATH = "${env.WORKSPACE}/.node/bin:${env.PATH}"
    }

    stages {
        stage('Setup Node') {
            steps {
                // One-time Node install per workspace. Skipped silently
                // when .node/bin/node already exists (re-runs are fast).
                sh '''
                    if [ ! -x .node/bin/node ]; then
                      mkdir -p .node
                      curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
                        | tar -xJ --strip-components=1 -C .node
                    fi
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install') {
            steps {
                sh 'npm install --no-audit --no-fund'
            }
        }

        stage('Test') {
            steps {
                // We DON'T fail the pipeline on a non-zero Jest exit —
                // we want JUnit reporting to run even when tests fail,
                // so the QA Hub gets accurate counts. `|| true` swallows
                // the exit code; the junit step below sets the build
                // status correctly based on what's actually in the XML.
                sh 'npm test -- --json --outputFile=reports/jest-out.json || true'
            }
        }
    }

    post {
        always {
            // Publish JUnit even on failure so we get the breakdown.
            // `allowEmptyResults: false` is the default — flagging
            // missing reports as suspicious is the right move.
            junit testResults: 'reports/junit.xml', allowEmptyResults: false
            // Stash the raw Jest JSON output too — handy if we want
            // to compute timings later.
            archiveArtifacts artifacts: 'reports/jest-out.json',
                             allowEmptyArchive: true,
                             onlyIfSuccessful: false
        }
    }
}
