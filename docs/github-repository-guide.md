# Campus-Hire GitHub Repository Guide

## 1. Purpose

This document describes the GitHub repository structure, branching model, Pull Request workflow, repository protection rules, collaboration process, GitHub Actions integration, and project task-management practices used for the Campus-Hire project.

The purpose of this guide is to maintain a consistent source-control workflow and help contributors understand how changes are managed and integrated.

---

## 2. Repository Overview

**Repository:** `College-placement-portal`
**Visibility:** Public
**GitHub Default Branch:** `main`
**Active Integration Branch:** `develop`

> The `main` branch is currently the GitHub default branch but is not used for day-to-day project development. Development changes are integrated through the `develop` branch.

### Repository Structure

```text
College-placement-portal/
├── frontend/                  # React + Vite frontend
├── backend/                   # Spring Boot backend
├── database/                  # Database-related files
├── infra/                     # Infrastructure-related files
├── uploads/                   # Application upload directory
├── .github/
│   └── workflows/
│       ├── pr-check.yml
│       ├── develop-sonar.yml
│       └── deploy.yml
├── .gitignore
└── README.md
```

---

## 3. Branching Strategy

The project uses separate branches for development work and a shared `develop` branch for integration.

### Current Branch Model

| Branch                          | Purpose                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| `main`                          | GitHub default branch; currently not used for active integration |
| `develop`                       | Main development and integration branch                          |
| `divya_infra`                   | Infrastructure, CI/CD, deployment, and documentation changes     |
| `jayashree_frontend`            | Frontend development                                             |
| `gaurav_backend`                | Backend development                                              |
| `gorakhnath_database`           | Database development                                             |
| `nikita-frontend`               | Frontend development                                             |
| `yuti-frontend`                 | Frontend development                                             |
| `feature/sonarqube-integration` | Feature-specific SonarQube integration work                      |

Developer and feature branches are used to isolate changes before they are integrated into `develop`.

### Development Flow

```text
Developer / Feature Branch
          ↓
     Code Changes
          ↓
        Push
          ↓
Pull Request → develop
          ↓
 Automated Status Checks
          ↓
       Merge
```

Direct development changes are not intended to be made directly on the protected `develop` branch.

---

## 4. Pull Request Workflow

Developers submit their changes to the `develop` branch through Pull Requests.

### Process

1. Developer works on the assigned developer or feature branch.
2. Changes are committed and pushed to GitHub.
3. A Pull Request is created with `develop` as the target branch.
4. GitHub Actions automatically runs the required PR checks.
5. The merge option becomes available after the required checks complete successfully.
6. The developer can merge the Pull Request into `develop`.

### Code Review

Manual reviewer approval is currently optional.

The repository relies primarily on required automated status checks before code can be merged into `develop`.

---

## 5. Develop Branch Protection

The `develop` branch has protection rules configured to control code integration.

Current protection includes:

* **Pull Request required before merging**
* **Required status checks must pass before merging**
* **Branch must be up to date before merging**
* Manual approval is not currently mandatory
* Code Owner approval is not currently required

This prevents unchecked changes from being directly integrated into the active development branch.

---

## 6. Automated Pull Request Checks

Pull Requests targeting `develop` trigger the GitHub Actions PR validation workflow.

**Workflow:** `.github/workflows/pr-check.yml`

The workflow performs automated validation for both application layers:

### Backend

* Source checkout
* Java environment setup
* Maven build
* SonarCloud analysis

### Frontend

* Source checkout
* Node.js environment setup
* Dependency installation
* Unit tests and code coverage
* Production build
* SonarCloud analysis

The required GitHub status checks must complete before the Pull Request can be merged.

Detailed CI/CD implementation is documented separately in the CI/CD Pipeline Guide.

---

## 7. GitHub Actions Workflows

The repository currently contains three GitHub Actions workflows.

| Workflow            | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `pr-check.yml`      | Validates Pull Requests before integration into `develop`            |
| `develop-sonar.yml` | Performs SonarCloud analysis of the latest integrated `develop` code |
| `deploy.yml`        | Automatically deploys merged `develop` code to AWS                   |

These workflows separate Pull Request validation, code-quality analysis, and deployment responsibilities.

---

## 8. Repository Access and Collaboration

Project contributors are added to the repository as collaborators.

The repository currently includes contributors working across:

* Frontend development
* Backend development
* Database development
* Infrastructure and deployment

Each contributor works primarily through their assigned developer or feature branch and submits changes through Pull Requests.

Repository access should be used only for project-related development and collaboration.

---

## 9. GitHub Project Task Management

The project uses a GitHub Projects board named:

**College Placement Portal Task Board**

The board is used to track development and infrastructure activities.

Tracked information includes:

* Task title
* Assignee
* Status
* Linked Pull Requests
* Sub-issue progress
* Start date
* End date

Typical task statuses include:

* `Todo`
* `Done`

Examples of tracked work include:

* Frontend dashboard development
* Backend API development
* AWS infrastructure setup
* Database server preparation
* API integration and testing
* Infrastructure issue resolution

The task board provides centralized visibility into project progress and individual responsibilities.

---

## 10. Repository Standards

### `.gitignore`

The repository contains a `.gitignore` file to prevent unnecessary or environment-specific files from being committed.

### README

The root `README.md` provides a high-level technical overview of the Campus-Hire project, including:

* Technology stack
* Repository structure
* Development workflow
* CI/CD overview
* Deployment information
* Code-quality and security overview

### Secrets

Sensitive values such as tokens, passwords, private keys, and credentials must not be stored directly in repository files.

GitHub Secrets should be used for sensitive values required by automated workflows.

---

## 11. Contributor Guidelines

Contributors should follow these practices:

* Work from the appropriate developer or feature branch.
* Avoid making development changes directly on `develop`.
* Keep commits focused on a specific change.
* Use meaningful commit messages.
* Push changes to the developer branch before creating a Pull Request.
* Create Pull Requests against `develop`.
* Wait for required automated checks to complete.
* Resolve failed checks before merging.
* Keep the branch updated with the latest `develop` changes when required.
* Do not commit passwords, tokens, private keys, or environment secrets.
* Update documentation when repository workflows or architecture change.

---

## 12. GitHub Collaboration Flow

```text
Task Assigned
     ↓
Developer Branch
     ↓
Implementation
     ↓
Commit & Push
     ↓
Pull Request → develop
     ↓
GitHub Actions PR Checks
     ↓
Required Checks Pass
     ↓
Merge into develop
     ↓
Automated Sonar Analysis + AWS Deployment
```

---

## 13. Related Documentation

Detailed engineering documentation is maintained separately.

* `README.md` — Project overview
* `docs/github-repository-guide.md` — GitHub repository and collaboration process
* `docs/cicd-pipeline.md` — CI/CD pipeline and deployment process
