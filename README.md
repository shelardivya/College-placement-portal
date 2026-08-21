# Campus-Hire

Campus-Hire is a centralized campus placement management platform for **students** and **placement administrators**. It brings placement opportunities, applications, drives, queries, analytics, and other placement activities into a single web application.

**Live Application:** https://campus-hire.duckdns.org

---

## Tech Stack

| Layer                      | Technology                       |
| -------------------------- | -------------------------------- |
| Frontend                   | React + Vite                     |
| Backend                    | Java 17 + Spring Boot            |
| Database                   | PostgreSQL                       |
| Authentication             | JWT                              |
| Password Security          | BCrypt                           |
| Authorization              | Role-Based Access Control (RBAC) |
| Cloud                      | AWS                              |
| Web Server / Reverse Proxy | Nginx                            |
| CI/CD                      | GitHub Actions                   |
| Code Quality               | SonarCloud                       |
| Security Testing           | HostedScan                       |

---

## Repository Structure

```text
College-placement-portal/
├── frontend/                  # React + Vite frontend
├── backend/                   # Spring Boot backend
├── database/                  # Database-related files
├── infra/                     # Infrastructure-related files
├── uploads/                   # Application upload directory
├── docs/
│   ├── github-repository-guide.md
│   └── cicd-pipeline.md       
├── .github/
│   └── workflows/
│       ├── pr-check.yml
│       ├── develop-sonar.yml
│       └── deploy.yml
├── .gitignore
└── README.md
```

---

## Development Workflow

Changes are developed on individual developer or feature branches and integrated into the `develop` branch through Pull Requests.

```text
Developer / Feature Branch
          ↓
     Pull Request
          ↓
 Build + Test + SonarCloud
          ↓
     Code Review
          ↓
    Merge to develop
```

---

## CI/CD

GitHub Actions is used for automated validation, code-quality analysis, and deployment.

### Pull Request Validation

`pr-check.yml`

* Triggered on Pull Requests to `develop`
* Builds the Backend
* Runs Frontend tests and coverage
* Builds the Frontend
* Runs separate SonarCloud analysis for Frontend and Backend

### Develop Branch Analysis

`develop-sonar.yml`

* Triggered after code is merged into `develop`
* Updates the latest SonarCloud analysis for the integrated codebase
* Frontend and Backend are analyzed independently

### Automated Deployment

`deploy.yml`

* Triggered on changes merged into `develop`
* Runs on a Self-Hosted GitHub Runner
* Builds and deploys the Spring Boot Backend
* Restarts the Backend service
* Verifies Backend availability
* Builds and deploys the React Frontend

---

## Deployment

The application is deployed on AWS using a custom VPC architecture.

* **Jump Server:** Public Subnet
* **Application Server:** Private Subnet
* **Database Server:** Private Subnet
* **Frontend:** React + Vite
* **Backend:** Spring Boot
* **Database:** PostgreSQL
* **Reverse Proxy:** Nginx
* **Domain:** `campus-hire.duckdns.org`
* **Security:** HTTPS / SSL and AWS Security Groups
* **Email Service:** Postfix configured on the Jump Server

---

## Code Quality

SonarCloud is integrated with the GitHub workflow for continuous code-quality analysis.

Frontend and Backend are maintained as separate SonarCloud projects and analyzed for:

* Security
* Reliability
* Maintainability
* Code Coverage
* Code Duplication
* Quality Gate conditions

---

## Security

The project implements multiple security controls, including:

* JWT-based authentication
* BCrypt password hashing
* Role-Based Access Control
* HTTPS / SSL
* AWS Security Groups
* Protected private application and database servers
* Vulnerability assessment using HostedScan

Security assessment includes tools such as **OWASP ZAP, Nmap, Nuclei, SSLyze, and OpenVAS**.

---

## Project Status

Campus-Hire is deployed on AWS with automated CI/CD, SonarCloud code-quality analysis, HTTPS, and security assessment integrated into the development workflow.
