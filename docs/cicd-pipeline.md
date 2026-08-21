# Campus-Hire CI/CD Pipeline & Deployment Guide

## 1. Purpose

This document describes the Continuous Integration and Continuous Deployment (CI/CD) implementation used for the Campus-Hire project.

It covers:

* Pull Request validation
* Frontend and Backend build process
* Frontend unit testing and code coverage
* SonarCloud code-quality analysis
* Automated deployment to the AWS Application Server
* Self-hosted GitHub Actions Runner
* Backend service management
* Frontend deployment through Nginx
* Deployment verification
* Logging and troubleshooting
* Current pipeline limitations

---

## 2. CI/CD Technology Stack

| Component                  | Technology                        |
| -------------------------- | --------------------------------- |
| Source Control             | GitHub                            |
| CI/CD Platform             | GitHub Actions                    |
| PR / Sonar Runner          | GitHub-hosted `ubuntu-latest`     |
| Deployment Runner          | Self-hosted GitHub Actions Runner |
| Backend                    | Java 17 + Spring Boot + Maven     |
| Frontend                   | React + Vite + Node.js 24         |
| Frontend Testing           | Vitest                            |
| Frontend Coverage          | LCOV                              |
| Code Quality               | SonarCloud                        |
| Cloud Platform             | AWS                               |
| Web Server / Reverse Proxy | Nginx                             |
| Backend Service Manager    | systemd                           |

---

## 3. CI/CD Pipeline Overview

The project separates Pull Request validation, deployment, and post-merge SonarCloud analysis into independent GitHub Actions workflows.

```text
Developer / Feature Branch
          ↓
     Pull Request
          ↓
   PR Check Workflow
          ↓
 ┌─────────────────────────┐
 │                         │
Backend Build         Frontend Test
+ SonarCloud          + Coverage
                      + Build
                      + SonarCloud
 │                         │
 └────────────┬────────────┘
              ↓
     Required Checks
              ↓
      Merge to develop
              ↓
 ┌──────────────────────────────┐
 │                              │
 ▼                              ▼
AWS Deployment            Develop Sonar Analysis
deploy.yml                develop-sonar.yml
 │                              │
 ▼                              ▼
Application Server        SonarCloud Dashboard
```

The deployment and post-merge Sonar analysis run independently.

This prevents a long-running SonarCloud analysis from blocking the AWS deployment workflow.

---

## 4. GitHub Actions Workflows

The repository contains three CI/CD workflow files:

```text
.github/workflows/
├── pr-check.yml
├── develop-sonar.yml
└── deploy.yml
```

| Workflow            | Trigger                  | Purpose                                             |
| ------------------- | ------------------------ | --------------------------------------------------- |
| `pr-check.yml`      | Pull Request → `develop` | Build, test, and SonarCloud validation before merge |
| `develop-sonar.yml` | Push → `develop`         | Analyze the latest integrated code in SonarCloud    |
| `deploy.yml`        | Push → `develop`         | Automatically deploy the application to AWS         |

---

# 5. Pull Request Validation

**Workflow:** `.github/workflows/pr-check.yml`

## 5.1 Trigger

The workflow runs whenever a Pull Request targets the `develop` branch.

```yaml
on:
  pull_request:
    branches:
      - develop
```

The workflow uses GitHub-hosted `ubuntu-latest` runners.

Frontend and Backend validation run as separate jobs.

---

## 5.2 Backend PR Validation

The Backend job performs the following steps:

1. Checkout repository code.
2. Configure Java 17 using Eclipse Temurin.
3. Configure Maven dependency caching.
4. Build the Spring Boot application.
5. Run Backend SonarCloud analysis.

### Backend Build

```bash
mvn --batch-mode clean package -DskipTests
```

Backend unit tests are currently skipped during the CI build.

### Backend SonarCloud Scan

```yaml
projectBaseDir: backend
```

This ensures that the Backend SonarCloud project analyzes the Backend directory independently.

---

## 5.3 Frontend PR Validation

The Frontend job performs:

1. Checkout repository code.
2. Configure Node.js 24.
3. Configure npm dependency caching.
4. Install dependencies.
5. Run unit tests.
6. Generate test coverage.
7. Build the production Frontend.
8. Run Frontend SonarCloud analysis.

### Commands

```bash
npm ci
npm run test:coverage
npm run build
```

Frontend unit testing and code coverage are therefore part of the CI process.

The generated LCOV report is supplied to SonarCloud for coverage analysis.

---

## 5.4 Pull Request Merge Control

The `develop` branch has branch protection configured.

Current controls include:

* Pull Request required before merging
* Required status checks must pass
* Branch must be up to date before merging
* Manual reviewer approval is optional
* Code Owner approval is not currently required

After the required automated checks complete successfully, the developer can merge the Pull Request into `develop`.

---

# 6. Develop Branch SonarCloud Analysis

**Workflow:** `.github/workflows/develop-sonar.yml`

## 6.1 Trigger

```yaml
on:
  push:
    branches:
      - develop
```

The workflow runs after code is merged or otherwise pushed into `develop`.

Its purpose is to keep the SonarCloud analysis of the integrated `develop` code updated.

---

## 6.2 Backend Develop Analysis

The Backend job:

* Runs on `ubuntu-latest`
* Configures Java 17
* Builds the Backend
* Runs Backend SonarCloud analysis

```bash
mvn --batch-mode clean package -DskipTests
```

---

## 6.3 Frontend Develop Analysis

The Frontend job:

* Runs on `ubuntu-latest`
* Configures Node.js 24
* Installs dependencies
* Runs Frontend unit tests
* Generates coverage
* Builds the Frontend
* Runs SonarCloud analysis

```bash
npm ci
npm run test:coverage
npm run build
```

---

## 6.4 Sonar Analysis Concurrency

The workflow uses:

```yaml
concurrency:
  group: develop-sonar
  cancel-in-progress: true
```

If a newer merge reaches `develop` while an older Sonar analysis is still running, the previous analysis can be cancelled so that the latest integrated code receives priority.

This is useful because full Frontend SonarCloud analysis can take significantly longer than Pull Request analysis.

---

# 7. SonarCloud Configuration

Frontend and Backend are maintained as separate SonarCloud projects.

## 7.1 Backend SonarCloud Project

Configuration file:

```text
backend/sonar-project.properties
```

Current configuration:

```properties
sonar.projectKey=shelardivya_College-placement-portal-backend
sonar.organization=shelardivya

sonar.projectName=College Placement Portal - Backend
sonar.sources=src
sonar.sourceEncoding=UTF-8

sonar.java.binaries=target/classes

sonar.exclusions=target/**,uploads/**
```

The Backend SonarCloud project analyzes the Java Backend separately from the Frontend.

---

## 7.2 Frontend SonarCloud Project

Configuration file:

```text
frontend/sonar-project.properties
```

Current configuration:

```properties
sonar.projectKey=shelardivya_College-placement-portal-frontend
sonar.organization=shelardivya

sonar.projectName=College Placement Portal - Frontend
sonar.sources=src
sonar.sourceEncoding=UTF-8

sonar.exclusions=node_modules/**,dist/**,coverage/**,**/*.test.*,**/*.spec.*

sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

The Frontend coverage report generated during testing is imported using:

```properties
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

---

## 7.3 Quality Dimensions

SonarCloud is used to analyze:

* Security
* Reliability
* Maintainability
* Code Coverage
* Code Duplication
* Quality Gate conditions

The Quality Gate currently identifies areas requiring improvement.

The SonarCloud Quality Gate result itself is not currently configured as a separate mandatory merge or deployment gate.

---

# 8. GitHub Actions Secret

The repository currently uses one GitHub Actions Repository Secret:

| Secret        | Purpose                                      |
| ------------- | -------------------------------------------- |
| `SONAR_TOKEN` | Authenticates GitHub Actions with SonarCloud |

The secret is maintained under:

```text
Repository Settings
→ Secrets and variables
→ Actions
→ Repository secrets
```

Secret values must never be committed to source control or stored in project documentation.

The deployment workflow does not require AWS access keys because deployment runs directly on the AWS Application Server using the self-hosted GitHub Actions Runner.

---

# 9. Automated AWS Deployment

**Workflow:** `.github/workflows/deploy.yml`

## 9.1 Trigger

```yaml
on:
  push:
    branches:
      - develop
```

The deployment starts after code is merged or otherwise pushed into `develop`.

Unlike the CI jobs, the deployment job runs on:

```yaml
runs-on: self-hosted
```

The self-hosted runner is installed directly on the AWS Application Server.

---

# 10. Self-Hosted GitHub Actions Runner

A GitHub Actions Runner is configured on the AWS Application Server as a systemd service.

## Configuration

| Setting                | Value                                   |
| ---------------------- | --------------------------------------- |
| Host                   | AWS Application Server                  |
| Runner User            | `ubuntu`                                |
| Installation Directory | `/home/ubuntu/actions-runner`           |
| Working Directory      | `/home/ubuntu/actions-runner`           |
| Start Script           | `/home/ubuntu/actions-runner/runsvc.sh` |
| Service Manager        | systemd                                 |

Runner service:

```text
actions.runner.shelardivya-College-placement-portal.ip-10-0-0-71.service
```

Because the runner executes directly on the Application Server, the deployment workflow can access the local Backend and Frontend deployment directories.

---

# 11. Backend Deployment

## 11.1 Backend Build

The deployment workflow first builds the Backend application:

```bash
mvn clean package -DskipTests
```

The generated deployment artifact is:

```text
portal-0.0.1-SNAPSHOT.jar
```

---

## 11.2 Backend Artifact Deployment

The generated JAR is copied to:

```text
/opt/backend_app/College-placement-portal/backend/target/portal-0.0.1-SNAPSHOT.jar
```

Ownership is assigned to:

```text
backend_user:backend_user
```

The Backend service is then restarted:

```bash
sudo systemctl restart backend.service
```

---

# 12. Backend systemd Service

Backend execution is managed using:

```text
/etc/systemd/system/backend.service
```

Current service configuration:

| Setting           | Value                                               |
| ----------------- | --------------------------------------------------- |
| Service User      | `backend_user`                                      |
| Working Directory | `/opt/backend_app/College-placement-portal/backend` |
| Java Runtime      | `/usr/bin/java`                                     |
| JAR               | `target/portal-0.0.1-SNAPSHOT.jar`                  |
| Restart Policy    | `always`                                            |

The service executes:

```bash
/usr/bin/java -jar \
/opt/backend_app/College-placement-portal/backend/target/portal-0.0.1-SNAPSHOT.jar
```

The service is configured under the system multi-user target.

---

# 13. Backend Deployment Verification

After restarting the Backend service, the deployment workflow waits for the Backend to respond.

Current endpoint:

```text
http://127.0.0.1:8080/
```

The workflow retries the check:

```text
12 attempts × 5 seconds
```

Maximum waiting period is approximately:

```text
60 seconds
```

If the Backend does not respond, the workflow outputs service diagnostics:

```bash
sudo systemctl status backend.service --no-pager
sudo journalctl -u backend.service -n 50 --no-pager
```

and the deployment job fails.

> The current check confirms that the Backend endpoint responds to the request. A stronger application health endpoint and HTTP-status validation can be added as a future improvement.

---

# 14. Frontend Deployment

## 14.1 Frontend Build

After Backend deployment and verification, the workflow builds the Frontend.

```bash
npm ci
npm run build
```

Vite generates the production application inside:

```text
frontend/dist/
```

---

## 14.2 Frontend Deployment

The deployment target is:

```text
/opt/frontend_app/frontend/dist
```

The workflow creates the deployment directory when required:

```bash
sudo mkdir -p /opt/frontend_app/frontend/dist
```

The latest Frontend build is synchronized using:

```bash
rsync -a --delete
```

This keeps the deployed directory synchronized with the latest Frontend production build and removes files that are no longer present.

Ownership is assigned to:

```text
frontend_user:frontend_user
```

---

# 15. Nginx Application Routing

Nginx serves the Campus-Hire application.

## Domain

```text
campus-hire.duckdns.org
```

## Frontend Root

```text
/opt/frontend_app/frontend/dist
```

## Backend

Spring Boot runs locally on:

```text
127.0.0.1:8080
```

Nginx forwards Backend requests using:

```nginx
proxy_pass http://127.0.0.1:8080/;
```

The routing architecture is:

```text
User
 ↓
campus-hire.duckdns.org
 ↓
HTTPS / SSL
 ↓
Nginx
 ├── Frontend
 │     ↓
 │ /opt/frontend_app/frontend/dist
 │
 └── Backend Requests
         ↓
    127.0.0.1:8080
         ↓
    Spring Boot
```

HTTPS / SSL is enabled for the deployed domain.

---

# 16. Deployment Concurrency

The deployment workflow uses:

```yaml
concurrency:
  group: production-deployment
  cancel-in-progress: false
```

An active deployment is therefore not cancelled when another deployment request is triggered.

This prevents an in-progress deployment from being interrupted.

---

# 17. Logging and Troubleshooting

Troubleshooting is performed across several layers:

```text
GitHub Actions
      ↓
backend.service
      ↓
Backend Application Logs
      ↓
Nginx Logs
```

---

## 17.1 GitHub Actions Logs

The first place to investigate CI/CD failures is:

```text
GitHub Repository
→ Actions
→ Workflow Run
→ Job
→ Failed Step
```

GitHub Actions logs help identify failures during:

* Source checkout
* Backend build
* Frontend testing
* Frontend build
* SonarCloud analysis
* Backend deployment
* Service restart
* Backend verification
* Frontend deployment

---

## 17.2 Backend Service Logs

Check Backend service status:

```bash
sudo systemctl status backend.service
```

View recent systemd logs:

```bash
sudo journalctl -u backend.service -n 100 --no-pager
```

Monitor service logs:

```bash
sudo journalctl -u backend.service -f
```

---

## 17.3 Backend Application Logs

Backend application logs are stored in:

```text
/opt/backend_app/College-placement-portal/backend/logs/
```

Current log:

```text
backend-current.log
```

Historical logs:

```text
backend-YYYY-MM-DD.log.gz
```

Older logs are rotated and compressed.

View recent application logs:

```bash
tail -n 100 \
/opt/backend_app/College-placement-portal/backend/logs/backend-current.log
```

Monitor live application logs:

```bash
tail -f \
/opt/backend_app/College-placement-portal/backend/logs/backend-current.log
```

---

## 17.4 Nginx Logs

Nginx logs are stored under:

```text
/var/log/nginx/
```

Access log:

```text
/var/log/nginx/access.log
```

Error log:

```text
/var/log/nginx/error.log
```

View recent Nginx errors:

```bash
sudo tail -n 100 /var/log/nginx/error.log
```

View recent HTTP requests:

```bash
sudo tail -n 100 /var/log/nginx/access.log
```

Monitor Nginx errors:

```bash
sudo tail -f /var/log/nginx/error.log
```

---

# 18. Failure Investigation Flow

For deployment or application failures, the following investigation flow is used:

```text
Deployment Failure / Application Error
               ↓
       GitHub Actions Logs
               ↓
      backend.service Status
               ↓
       Backend Application Logs
               ↓
          Nginx Logs
               ↓
       Identify Root Cause
               ↓
        Apply Correction
               ↓
        Re-run Deployment
```

This provides a structured troubleshooting approach for CI/CD and runtime issues.

---

# 19. Rollback Strategy

An automated rollback mechanism is not currently configured.

If a deployment or application issue occurs, the current process is:

1. Inspect GitHub Actions logs.
2. Check `backend.service`.
3. Review Backend application logs.
4. Review Nginx logs when required.
5. Identify and correct the underlying issue.
6. Re-run the corrected deployment.

A formal artifact-based or automated rollback strategy is a recommended future improvement.

---

# 20. Current Pipeline Limitations

The following areas represent capabilities that are not yet fully implemented or enforced.

## 20.1 Backend Unit Testing and Coverage

Frontend unit testing and coverage are already integrated into the CI pipeline.

Frontend CI runs:

```bash
npm run test:coverage
```

The generated LCOV report is imported into SonarCloud using:

```properties
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

Backend unit testing and coverage integration are currently not implemented.

Backend builds currently use:

```bash
mvn clean package -DskipTests
```

Therefore:

* Backend tests are skipped in CI
* Automated Backend unit-test coverage is not generated
* Backend coverage is not currently available to SonarCloud through a test coverage report

---

## 20.2 SonarCloud Quality Gate Enforcement

SonarCloud analysis is integrated for both Frontend and Backend.

Current flow:

```text
SonarCloud Analysis
        ↓
Quality Results Generated
        ↓
Quality Gate Reviewed
```

The Quality Gate identifies areas requiring improvement.

However, the Quality Gate result itself is not currently configured as a separate mandatory merge or deployment-blocking condition.

Future implementation can enforce the Quality Gate after project quality conditions are brought to the required standard.

---

## 20.3 Frontend Post-Deployment Verification

The deployment workflow performs a Backend response check after restarting `backend.service`.

However, a separate HTTP verification step for the deployed Frontend is not currently configured.

Current Frontend flow:

```text
Frontend Build
      ↓
Deploy dist/
      ↓
Deployment Complete
```

A future improvement can verify the deployed application URL after synchronization.

---

## 20.4 Backend Health Check Improvement

The current Backend deployment verification uses:

```bash
curl -sS -o /dev/null http://127.0.0.1:8080/
```

This checks whether the endpoint responds.

A future improvement can use:

* A dedicated application health endpoint
* HTTP status validation
* Spring Boot Actuator health checks

This would provide stronger deployment verification.

---

## 20.5 Automated Rollback

Automated rollback is not currently implemented.

A future pipeline can introduce:

```text
Build
 ↓
Versioned Artifact
 ↓
Deploy
 ↓
Health Check
 ├── PASS → Keep Deployment
 └── FAIL → Restore Previous Version
```

This would improve deployment recovery and reliability.

---

# 21. CI/CD Operational Summary

```text
Developer / Feature Branch
          ↓
      Pull Request
          ↓
      pr-check.yml
          │
          ├── Backend
          │    ├── Java 17
          │    ├── Maven Build
          │    └── SonarCloud
          │
          └── Frontend
               ├── Node.js 24
               ├── Unit Tests
               ├── LCOV Coverage
               ├── Production Build
               └── SonarCloud
          ↓
   Required GitHub Checks
          ↓
     Merge to develop
          ↓
 ┌──────────────────────────────┐
 │                              │
 ▼                              ▼
deploy.yml                develop-sonar.yml
 │                              │
Self-Hosted Runner        GitHub-hosted Runner
 │                              │
Backend Build             Frontend + Backend
 │                        SonarCloud Analysis
Deploy JAR                      │
 │                              ▼
Restart backend.service   SonarCloud Dashboard
 │
Backend Verification
 │
Frontend Build
 │
Deploy via rsync
 │
 ▼
Campus-Hire Application
```

---

# 22. Related Documentation

* `README.md` — Project technical overview
* `docs/github-repository-guide.md` — GitHub repository and collaboration workflow
* `docs/cicd-pipeline.md` — CI/CD pipeline, deployment, and troubleshooting guide
