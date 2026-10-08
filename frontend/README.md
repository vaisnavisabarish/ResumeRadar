# ResumeRadar

> **Turn resume claims into evidence-backed career intelligence.**

ResumeRadar is an evidence-driven career intelligence platform that transforms a traditional resume from a collection of self-reported claims into a profile supported by observable evidence.

Instead of only asking:

> **"What does the candidate say they can do?"**

ResumeRadar asks:

> **"What evidence supports that claim, how strong is that evidence, and what should the candidate do next?"**

---

## Table of Contents

- [1. Problem Statement](#1-problem-statement)
- [2. Solution](#2-solution)
- [3. Core Idea](#3-core-idea)
- [4. Key Features](#4-key-features)
- [5. System Architecture](#5-system-architecture)
- [6. End-to-End Data Flow](#6-end-to-end-data-flow)
- [7. Technology Stack](#7-technology-stack)
- [8. Project Structure](#8-project-structure)
- [9. Prerequisites](#9-prerequisites)
- [10. Installation](#10-installation)
- [11. Environment Variables](#11-environment-variables)
- [12. Running the Application](#12-running-the-application)
- [13. First-Time User Tutorial](#13-first-time-user-tutorial)
- [14. Candidate Workflow](#14-candidate-workflow)
- [15. Recruiter Workflow](#15-recruiter-workflow)
- [16. API Reference](#16-api-reference)
- [17. Backend Architecture](#17-backend-architecture)
- [18. Resume Processing Pipeline](#18-resume-processing-pipeline)
- [19. Evidence Intelligence Model](#19-evidence-intelligence-model)
- [20. Role Intelligence](#20-role-intelligence)
- [21. Job Management](#21-job-management)
- [22. Database](#22-database)
- [23. Frontend Architecture](#23-frontend-architecture)
- [24. Design System](#24-design-system)
- [25. Development Commands](#25-development-commands)
- [26. Testing and Validation](#26-testing-and-validation)
- [27. Troubleshooting](#27-troubleshooting)
- [28. Real vs Prototype Functionality](#28-real-vs-prototype-functionality)
- [29. Limitations](#29-limitations)
- [30. Future Roadmap](#30-future-roadmap)
- [31. Responsible Use](#31-responsible-use)
- [32. Team](#32-team)

---

# 1. Problem Statement

A resume is primarily a **self-reported document**.

Candidates claim:

- "I know Python."
- "I built this project."
- "I conducted research."
- "I have experience with machine learning."
- "I have worked with GitHub."

Traditional resume screening mostly evaluates these claims from the document itself.

This creates several problems:

1. Claims may not have easily observable supporting evidence.
2. Strong candidate work can remain hidden across different platforms.
3. Recruiters have limited context for evaluating claims.
4. Candidates often know what they are missing but not what evidence would strengthen their profile.
5. A single resume score does not explain **why** a candidate matches or does not match a role.

ResumeRadar approaches the problem differently.

---

# 2. Solution

ResumeRadar converts a resume into an **evidence-backed career profile**.

The platform:

1. Extracts structured claims from a resume.
2. Identifies skills, projects, experience, education, and research.
3. Collects or processes available evidence from supplied/public sources.
4. Verifies claims where possible.
5. Presents evidence, confidence, sources, and limitations.
6. Compares the candidate against target roles.
7. Identifies potential skill and evidence gaps.
8. Provides actionable career and learning guidance.
9. Supports recruiter-oriented candidate and job workflows.

The central philosophy is:

> **A resume should be the starting point for investigation, not the final source of truth.**

---

# 3. Core Idea

The ResumeRadar pipeline is:

```text
┌──────────────┐
│    Resume    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Extraction  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Claims    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Evidence   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Verification │
└──────┬───────┘
       │
       ├───────────────┐
       ▼               ▼
┌──────────────┐ ┌──────────────┐
│ Role Match   │ │  Skill Gaps  │
└──────┬───────┘ └──────┬───────┘
       │               │
       └───────┬───────┘
               ▼
      ┌─────────────────┐
      │ Career Actions  │
      └─────────────────┘
```

The core relationship throughout the product is:

```text
CLAIM
  ↓
SOURCE
  ↓
EVIDENCE
  ↓
STATUS
  ↓
ACTION
```

---

# 4. Key Features

## 4.1 Resume Intelligence

Upload a PDF resume and extract structured information including:

- Candidate profile
- Education
- Technical skills
- Core skills
- Projects
- Experience
- Research

---

## 4.2 Evidence Verification

ResumeRadar can process available evidence from sources such as:

- GitHub
- LinkedIn URLs supplied by the candidate
- Portfolio URLs supplied by the candidate
- Research sources
- Stored verification results

Evidence can include:

- Source
- Verification status
- Confidence/relevance information
- Supporting links
- Limitations

### Important principle

```text
No evidence found
        ≠
Candidate cannot do it
```

Evidence availability is a signal, not proof of absolute ability.

---

## 4.3 Evidence Dashboard

The dashboard provides a high-level view of the candidate's evidence-backed profile.

It can surface:

- Candidate information
- Skills
- Evidence
- Role context
- Gaps
- Activity/evidence information
- Readiness-oriented information

---

## 4.4 Evidence Explorer

The Evidence page provides a detailed view of stored evidence.

Users can inspect:

- Claims
- Sources
- Status
- Scores/confidence
- Supporting links
- Evidence details

---

## 4.5 Digital Footprint

The Digital Footprint experience organizes available professional sources and shows how evidence relates to a candidate's profile.

The intended mental model is:

```text
Source
  │
  ├── Evidence
  │     ├── Claim A
  │     └── Claim B
  │
  └── Profile signal
```

---

## 4.6 Career Gaps

Career Gaps helps identify areas that may require:

- Stronger evidence
- Additional skills
- Better role alignment
- Additional development

The goal is to move from:

```text
"You have a gap."
```

to:

```text
"Here is the gap.
Here is why it matters.
Here is what evidence exists.
Here is what you can do next."
```

---

## 4.7 Gaps & Roadmap

The roadmap connects career gaps to practical learning milestones.

```text
Gap
 ↓
Learning Objective
 ↓
Milestone
 ↓
Practical Evidence
```

---

## 4.8 Role Analyzer

Candidates can analyze their profile against target roles.

The Role Analyzer provides:

- Role match information
- Skill coverage
- Requirement comparison
- Relevant resume skills
- Keyword-fit information
- Semantic comparison
- Targeted resume preview

Different analysis methods are kept visually distinct rather than treating every number as the same measurement.

---

## 4.9 Resume Generation

ResumeRadar can generate a targeted resume preview for a selected role.

The generated preview can contain:

- Full name
- Professional title
- Summary
- Selected skills
- Optimized projects

---

## 4.10 Job Management

The application includes job-management functionality.

Supported operations include:

- Create jobs
- View jobs
- Edit jobs
- Delete jobs
- Define required skills
- Define readiness requirements
- Set deadlines

---

## 4.11 Recruiter Workspace

The recruiter experience provides:

- Candidate search
- Candidate filtering
- Candidate profiles
- Job management
- Shortlisting
- Recruiter-oriented insights

---

# 5. System Architecture

ResumeRadar currently consists of a React frontend and two Node.js/Express backend services.

```text
                                  ┌─────────────────────┐
                                  │        USER         │
                                  │                     │
                                  │ Candidate / Recruiter│
                                  └──────────┬──────────┘
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                         REACT FRONTEND                             │
│                                                                    │
│  React 19 + Vite + React Router + Tailwind CSS + Lucide React     │
│                                                                    │
│  ┌──────────────────────┐             ┌─────────────────────────┐  │
│  │ Candidate Workspace  │             │   Recruiter Workspace   │  │
│  │                      │             │                         │  │
│  │ • Dashboard          │             │ • Candidates            │  │
│  │ • Upload             │             │ • Jobs                  │  │
│  │ • Evidence           │             │ • Shortlist             │  │
│  │ • Digital Footprint  │             │ • Insights              │  │
│  │ • Career Gaps        │             │                         │  │
│  │ • Roadmap            │             │                         │  │
│  │ • Role Analyzer      │             │                         │  │
│  │ • Resume Improver    │             │                         │  │
│  └───────────┬──────────┘             └────────────┬────────────┘  │
│              │                                     │               │
└──────────────┼─────────────────────────────────────┼───────────────┘
               │                                     │
               │ HTTP                                │ HTTP
               ▼                                     ▼
┌──────────────────────────────┐       ┌─────────────────────────────┐
│       PDF INTAKE SERVICE     │       │     VERIFICATION SERVICE    │
│          PORT 5000           │       │          PORT 5001           │
│                              │       │                             │
│ • PDF Upload                 │       │ • Candidate persistence     │
│ • PDF Parsing                │       │ • Evidence verification     │
│ • Resume Extraction          │       │ • GitHub verification       │
│ • Skill Extraction           │       │ • Role analysis             │
│ • Project Extraction         │       │ • Semantic comparison       │
│ • Experience Extraction      │       │ • Gap / roadmap API         │
│ • Research Extraction        │       │ • Resume generation         │
│ • Research Verification      │       │ • Job CRUD                  │
└──────────────┬───────────────┘       └──────────────┬──────────────┘
               │                                      │
               │                                      ▼
               │                          ┌──────────────────────────┐
               │                          │      SQLITE DATABASE     │
               │                          │                          │
               │                          │ • Candidates             │
               │                          │ • Companies              │
               │                          │ • Evidence               │
               │                          │ • Experience             │
               │                          │ • Jobs                   │
               │                          │ • Verification results   │
               │                          └──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SOURCES                              │
│                                                                     │
│  GitHub              Semantic Scholar       LinkedIn / Portfolio   │
│  repositories        research records       supplied URLs          │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 6. End-to-End Data Flow

The complete candidate flow is:

```text
Candidate
   │
   │ Upload PDF
   ▼
React Frontend
   │
   │ POST /api/resume/upload
   ▼
PDF Intake Backend :5000
   │
   ├── PDF parsing
   ├── Text cleanup
   ├── Section detection
   ├── Candidate extraction
   ├── Skill extraction
   ├── Project extraction
   ├── Experience extraction
   └── Research extraction
   │
   ▼
Structured Resume JSON
   │
   │ Research verification
   ▼
Semantic Scholar
   │
   ▼
Frontend receives extraction result
   │
   │ POST /api/verify
   ▼
Verification Backend :5001
   │
   ├── Candidate persistence
   ├── Company handling
   ├── Evidence processing
   ├── GitHub verification
   ├── Role analysis
   └── Other verification logic
   │
   ▼
SQLite
   │
   ▼
Frontend
   │
   ├── Dashboard
   ├── Evidence
   ├── Digital Footprint
   ├── Career Gaps
   ├── Roadmap
   ├── Role Analyzer
   └── Resume Generation
```

---

# 7. Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | UI framework |
| Vite | Development/build tooling |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| Lucide React | Icons |

## PDF Intake Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express | HTTP server |
| Multer | File upload handling |
| PDF parser | PDF text extraction |
| Axios | External API requests |
| Semantic Scholar | Research verification |

## Verification Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express | HTTP server |
| SQLite | Persistence |
| GitHub API | Repository verification |
| Gemini/Google AI | Resume generation where configured |

---

# 8. Project Structure

```text
ResumeRadar/
│
├── backend/
│   │
│   ├── pdf-intake/
│   │   ├── server.js
│   │   ├── parser.js
│   │   ├── resumeParser.js
│   │   ├── researchVerifier.js
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   └── verification/
│       ├── server.js
│       ├── package.json
│       └── package-lock.json
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar/
│   │   │   └── EvidenceDetail/
│   │   │
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Welcome/
│   │   │   ├── Applicant/
│   │   │   ├── Recruiter/
│   │   │   ├── Upload/
│   │   │   ├── Dashboard/
│   │   │   ├── Evidence/
│   │   │   ├── Footprint/
│   │   │   ├── CareerGaps/
│   │   │   ├── Gaps/
│   │   │   ├── RoleAnalyzer/
│   │   │   ├── Jobs/
│   │   │   ├── ResumeImprover/
│   │   │   └── RecruiterDashboard/
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 9. Prerequisites

Install the following before running ResumeRadar:

- Node.js
- npm
- Git

Verify the installation:

```bash
node --version
npm --version
git --version
```

---

# 10. Installation

## 10.1 Clone the Repository

```bash
git clone https://github.com/vaisnavisabarish/ResumeRadar.git
cd ResumeRadar
```

---

## 10.2 Install PDF Intake Dependencies

### Windows PowerShell

```powershell
npm.cmd --prefix backend/pdf-intake install
```

### Linux / macOS

```bash
npm --prefix backend/pdf-intake install
```

---

## 10.3 Install Verification Dependencies

### Windows PowerShell

```powershell
npm.cmd --prefix backend/verification install
```

### Linux / macOS

```bash
npm --prefix backend/verification install
```

---

## 10.4 Install Frontend Dependencies

```bash
cd frontend
```

### Windows PowerShell

```powershell
npm.cmd install
```

### Linux / macOS

```bash
npm install
```

Return to the repository root:

```bash
cd ..
```

---

# 11. Environment Variables

Some integrations require API credentials.

Depending on the functionality being used, configure the environment variables expected by the respective backend.

Typical integrations include:

- GitHub
- Gemini / Google AI

### Important

Never commit API keys or secrets to GitHub.

Example:

```env
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
```

Use the actual environment variable names expected by the current backend implementation.

---

# 12. Running the Application

ResumeRadar uses **three processes** during normal development:

```text
Frontend       → Port 5173
PDF Intake     → Port 5000
Verification   → Port 5001
```

You should normally use three terminals.

---

## Terminal 1 — PDF Intake Backend

From the repository root:

### Windows

```powershell
npm.cmd --prefix backend/pdf-intake start
```

### Linux / macOS

```bash
npm --prefix backend/pdf-intake start
```

The service should run on:

```text
http://localhost:5000
```

---

## Terminal 2 — Verification Backend

From the repository root:

### Windows

```powershell
npm.cmd --prefix backend/verification start
```

### Linux / macOS

```bash
npm --prefix backend/verification start
```

The service should run on:

```text
http://localhost:5001
```

---

## Terminal 3 — Frontend

```bash
cd frontend
```

### Windows

```powershell
npm.cmd run dev
```

### Linux / macOS

```bash
npm run dev
```

Vite normally starts the application at:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 13. First-Time User Tutorial

This section explains how to use ResumeRadar from a clean installation.

---

## Step 1 — Start all services

Make sure these are running:

```text
Terminal 1 → PDF Intake → :5000
Terminal 2 → Verification → :5001
Terminal 3 → Frontend → :5173
```

---

## Step 2 — Open ResumeRadar

Open:

```text
http://localhost:5173
```

You should see the ResumeRadar landing page.

---

## Step 3 — Enter the Candidate Experience

Choose the candidate portal.

The candidate workspace provides access to:

```text
Dashboard
Upload
Evidence
Digital Footprint
Career Gaps
Gaps & Roadmap
Role Analyzer
Resume Improver
```

---

## Step 4 — Upload a Resume

Navigate to:

```text
Dashboard → Upload
```

Select a PDF resume.

Optional source information may include:

- GitHub URL
- LinkedIn URL
- Portfolio URL

Submit the resume.

---

## Step 5 — Resume Extraction

The PDF Intake backend receives the file:

```text
POST /api/resume/upload
```

The system processes:

```text
PDF
 ↓
Text extraction
 ↓
Section detection
 ↓
Candidate information
 ↓
Education
 ↓
Skills
 ↓
Projects
 ↓
Experience
 ↓
Research
```

The resulting structured information is returned to the frontend.

---

## Step 6 — Research Verification

Research claims can be checked against Semantic Scholar.

The research verification process attempts to find matching academic information.

The result can contain:

- Verification status
- Source
- URL
- Matched title
- Matched year
- Venue

---

## Step 7 — Candidate Verification

The extracted profile is then sent to:

```text
POST /api/verify
```

The Verification Backend processes and stores the candidate information.

Available evidence is processed at this stage.

---

## Step 8 — Open the Dashboard

After successful verification, navigate to:

```text
Dashboard
```

The dashboard provides an overview of:

- Candidate profile
- Skills
- Evidence
- Role information
- Gaps
- Activity/evidence information

---

## Step 9 — Inspect Evidence

Open:

```text
Dashboard → Evidence
```

Select an evidence item to inspect its details.

Look for:

```text
Claim
Source
Status
Score / confidence
Supporting information
External link
```

---

## Step 10 — Explore Digital Footprint

Open:

```text
Dashboard → Digital Footprint
```

This provides a source-oriented view of the candidate's available professional evidence.

---

## Step 11 — Review Career Gaps

Open:

```text
Dashboard → Career Gaps
```

Review potential areas where the candidate may need:

- Additional evidence
- Additional skills
- Better role alignment
- Further development

---

## Step 12 — Explore the Roadmap

Open:

```text
Dashboard → Gaps & Roadmap
```

Select a target role.

Explore the available learning milestones.

---

## Step 13 — Analyze a Target Role

Open:

```text
Dashboard → Role Analyzer
```

Select a role.

The page can display:

- Role match
- Skill coverage
- Requirement comparison
- Relevant resume skills
- Keyword-fit information
- Semantic comparison

---

## Step 14 — Generate a Targeted Resume

Use the resume generation functionality in Role Analyzer.

The generated preview can contain:

```text
Full Name
Professional Title
Summary
Selected Skills
Optimized Projects
```

---

## Step 15 — Explore Recruiter Mode

Return to the landing page.

Choose the recruiter experience.

The recruiter workspace provides access to candidate and job-management workflows.

---

# 14. Candidate Workflow

The intended candidate workflow is:

```text
┌──────────────┐
│    Welcome   │
└──────┬───────┘
       ▼
┌──────────────┐
│ Candidate    │
│ Entry        │
└──────┬───────┘
       ▼
┌──────────────┐
│   Upload     │
│    Resume    │
└──────┬───────┘
       ▼
┌──────────────┐
│   Extract    │
│    Claims    │
└──────┬───────┘
       ▼
┌──────────────┐
│  Verify      │
│   Evidence   │
└──────┬───────┘
       ▼
┌──────────────┐
│  Dashboard   │
└──────┬───────┘
       │
       ├──────────────► Evidence
       │
       ├──────────────► Digital Footprint
       │
       ├──────────────► Career Gaps
       │
       ├──────────────► Roadmap
       │
       ├──────────────► Role Analyzer
       │
       └──────────────► Resume Generation
```

---

# 15. Recruiter Workflow

The recruiter workflow is:

```text
Welcome
   ↓
Recruiter Entry
   ↓
Recruiter Dashboard
   ↓
Candidate Search
   ↓
Candidate Filtering
   ↓
Candidate Profile
   ↓
Evidence / Profile Inspection
   ↓
Shortlist
   ↓
Job Management
```

Recruiter job management supports:

```text
Create
  ↓
View
  ↓
Edit
  ↓
Delete
```

---

# 16. API Reference

## PDF Intake API

### Upload Resume

```http
POST /api/resume/upload
```

The frontend sends:

```text
multipart/form-data
```

with the PDF in the:

```text
resume
```

field.

The response contains extracted candidate information.

---

# Verification API

## Verify Candidate

```http
POST /api/verify
```

Receives the extracted resume/profile data and processes verification.

---

## Get Candidates

```http
GET /api/candidates
```

Returns stored candidates and associated information.

---

## Role Analysis

```http
GET /api/role-analysis
```

Returns role-analysis information.

---

## Gap / Roadmap

```http
GET /api/gaps-roadmap
```

Returns gap and roadmap information.

---

## Semantic Comparison

```http
GET /api/semantic-compare?role=<role>
```

The selected role should be URL encoded.

The frontend consumes comparison information such as:

```text
method
overall_compatibility_score
comparison_table
```

Comparison rows can contain:

```text
requirement
relevant_resume_skills
score
status
```

---

## Resume Generation

```http
POST /api/generate-resume
```

Request:

```json
{
  "targetRole": "Software Engineer"
}
```

The generated result can contain:

```text
fullName
professionalTitle
summary
selectedSkills
optimizedProjects
```

---

# Job API

## Get Jobs

```http
GET /api/jobs
```

---

## Create Job

```http
POST /api/jobs
```

Example structure:

```json
{
  "title": "Software Engineer",
  "company": "Example Company",
  "location": "Chennai",
  "type": "Full-time",
  "readiness": 75,
  "skills": [
    "Python",
    "SQL",
    "Git"
  ],
  "description": "Software engineering role",
  "deadline": "2026-12-31"
}
```

---

## Update Job

```http
PUT /api/jobs/:id
```

---

## Delete Job

```http
DELETE /api/jobs/:id
```

---

# 17. Backend Architecture

ResumeRadar intentionally separates PDF processing from verification.

## PDF Intake Service

Location:

```text
backend/pdf-intake/
```

Responsibilities:

```text
File Upload
     ↓
PDF Parsing
     ↓
Text Cleaning
     ↓
Section Detection
     ↓
Structured Extraction
     ↓
Research Verification
     ↓
JSON Response
```

This keeps resume extraction independent from the verification system.

---

## Verification Service

Location:

```text
backend/verification/
```

Responsibilities include:

- Candidate persistence
- Evidence processing
- GitHub verification
- Role analysis
- Semantic comparison
- Gap analysis
- Resume generation
- Job management

---

# 18. Resume Processing Pipeline

The PDF parser identifies multiple sections of a resume.

```text
PDF
 │
 ▼
Text Extraction
 │
 ▼
Text Cleaning
 │
 ├── Candidate
 │
 ├── Education
 │
 ├── Skills
 │
 ├── Projects
 │
 ├── Experience
 │
 └── Research
 │
 ▼
Structured Candidate JSON
```

Example conceptual structure:

```json
{
  "candidate": {},
  "education": [],
  "skills": {
    "technical": [],
    "core": []
  },
  "projects": [],
  "experience": [],
  "research": []
}
```

Research entries can additionally contain verification information.

---

# 19. Evidence Intelligence Model

ResumeRadar is built around the distinction between:

### Claim

Something stated by the candidate.

Example:

```text
"I built a Python project."
```

### Evidence

An observable source supporting the claim.

Example:

```text
GitHub repository
```

### Status

The system's recorded interpretation of the available evidence.

Conceptually:

```text
Claim
  │
  ▼
Evidence Source
  │
  ▼
Verification Result
  │
  ▼
Candidate Insight
```

The system should distinguish between:

- Verified
- Partial / uncertain
- No evidence found
- Unable to verify
- Ambiguous

These states should not be interpreted as absolute judgments of ability.

---

# 20. Role Intelligence

Role analysis compares candidate information against target role requirements.

Conceptually:

```text
Target Role
     │
     ▼
Requirements
     │
     ▼
Candidate Skills
     │
     ▼
Relevant Evidence
     │
     ▼
Role Compatibility
```

The platform can expose different forms of analysis, including:

- Role match
- Skill coverage
- Keyword fit
- Semantic comparison

These should be treated as different analytical signals rather than a single universal "truth score."

---

# 21. Job Management

ResumeRadar includes job-management capabilities.

A job contains information such as:

```text
Title
Company
Location
Type
Readiness Requirement
Required Skills
Description
Deadline
```

Supported operations:

```text
GET    /api/jobs
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

Jobs are persistent backend operations and should be tested carefully.

---

# 22. Database

The verification backend uses SQLite for persistence.

Stored information can include:

- Candidates
- Companies
- Evidence
- Experience-related records
- Jobs
- Verification results

The database provides persistence across frontend sessions rather than relying exclusively on browser state.

---

# 23. Frontend Architecture

The frontend is a React/Vite application.

## Main Routes

```text
/
├── /applicant/login
├── /recruiter/login
├── /recruiter-dashboard
├── /jobs
│
└── /dashboard
    ├── /upload
    ├── /evidence
    ├── /digital-footprint
    ├── /career-gaps
    ├── /gaps
    ├── /role-analyzer
    └── /resume-improver
```

The application uses:

- React components
- Local state
- React Router
- Fetch API
- Tailwind CSS
- Lucide icons

The candidate pages share a common dashboard shell and sidebar.

---

# 24. Design System

ResumeRadar's visual direction is:

> **Evidence Intelligence / Signal Map**

The workspace uses a cool cyan/light-blue environment rather than the earlier warm ivory/burgundy design.

## Core Palette

| Purpose | Color |
|---|---|
| Main workspace | `#CFEFF5` |
| Secondary workspace | `#BFE7EF` |
| Main surface | `#F7FCFD` |
| Deep blue | `#0B405A` |
| Primary navy | `#06283D` |
| Primary cyan | `#16B8D0` |
| Bright cyan | `#55D9E8` |
| Supporting blue | `#278BB5` |
| Action orange | `#FF8158` |
| Discovery / score | `#F7B942` |
| Verified | `#18A875` |
| Error | `#E05252` |

## Visual Principles

ResumeRadar avoids:

- Ivory workspace
- Burgundy/pink visual identity
- Purple AI aesthetics
- Excessive neon
- Cyberpunk styling
- Glassmorphism
- Excessive gradients
- Excessive nested cards

The UI emphasizes:

- Clear evidence relationships
- Structured information
- Deep blue navigation
- Cyan evidence signals
- Strong visual hierarchy
- Accessible states
- Responsive navigation
- Restrained motion

---

# 25. Development Commands

## Install Everything

### Windows

```powershell
npm.cmd --prefix backend/pdf-intake install
npm.cmd --prefix backend/verification install
cd frontend
npm.cmd install
cd ..
```

### Linux/macOS

```bash
npm --prefix backend/pdf-intake install
npm --prefix backend/verification install
cd frontend
npm install
cd ..
```

---

## Start PDF Intake

### Windows

```powershell
npm.cmd --prefix backend/pdf-intake start
```

### Linux/macOS

```bash
npm --prefix backend/pdf-intake start
```

---

## Start Verification

### Windows

```powershell
npm.cmd --prefix backend/verification start
```

### Linux/macOS

```bash
npm --prefix backend/verification start
```

---

## Start Frontend

### Windows

```powershell
cd frontend
npm.cmd run dev
```

### Linux/macOS

```bash
cd frontend
npm run dev
```

---

## Build Frontend

### Windows

```powershell
cd frontend
npm.cmd run build
```

### Linux/macOS

```bash
cd frontend
npm run build
```

---

## Lint Frontend

### Windows

```powershell
cd frontend
npm.cmd run lint
```

### Linux/macOS

```bash
cd frontend
npm run lint
```

---

## Preview Production Build

```bash
cd frontend
npm run preview
```

---

# 26. Testing and Validation

Before considering a frontend change complete, verify:

```text
✓ Frontend builds
✓ Routes still load
✓ Candidate navigation works
✓ Upload page loads
✓ PDF upload flow works
✓ Verification request works
✓ Evidence page loads
✓ Role Analyzer loads
✓ Resume generation remains available
✓ Job CRUD still works
✓ Recruiter dashboard loads
```

Run:

```bash
cd frontend
npm run build
```

Then:

```bash
npm run lint
```

When testing the full application, run all three services.

---

# 27. Troubleshooting

## PowerShell says scripts are disabled

Windows PowerShell may block `npm.ps1`.

Use:

```powershell
npm.cmd
```

instead of:

```powershell
npm
```

For example:

```powershell
npm.cmd run dev
```

and:

```powershell
npm.cmd install
```

---

## Frontend opens but API calls fail

Make sure both backend services are running:

```text
PDF Intake     → http://localhost:5000
Verification   → http://localhost:5001
Frontend       → http://localhost:5173
```

---

## Port 5173 is already in use

Vite may automatically choose another port.

Use the URL printed by Vite.

---

## PDF upload fails

Check:

1. The PDF is valid.
2. PDF Intake is running.
3. Verification Backend is running.
4. Required environment variables are configured.
5. Browser developer tools for the exact request error.

---

## GitHub verification fails

Check:

- GitHub URL format
- Repository/profile availability
- Optional GitHub token configuration
- Backend console output

---

## Resume generation fails

Check:

- Gemini/Google AI environment configuration
- Verification backend is running
- Browser Network tab
- Backend logs

---

## Backend starts but frontend shows no data

Check that the frontend is calling:

```text
5000 → PDF Intake
5001 → Verification
```

and not another port.

---

# 28. Real vs Prototype Functionality

ResumeRadar is an evolving prototype. Some functionality is fully integrated while other experiences are currently demonstrations or heuristic implementations.

## Implemented / Integrated

- PDF upload
- Resume extraction
- Structured candidate extraction
- Research verification integration
- Candidate persistence
- Stored evidence
- GitHub verification
- Role analysis endpoint
- Semantic comparison endpoint
- Resume generation endpoint
- Job CRUD operations
- Candidate dashboard data retrieval
- Evidence inspection

## Prototype / Evolving

- Authentication
- Some Career Gap intelligence
- Some recruiter analytics
- Resume Improver
- Some roadmap personalization
- Some cross-source relationships
- Some readiness/activity metrics
- Some recruiter ranking signals

The interface should therefore distinguish between:

```text
Real stored evidence
        vs
Estimated intelligence
        vs
Prototype/demo experiences
```

This distinction is important to the long-term product direction.

---

# 29. Limitations

## Resume Parsing

Current extraction is primarily based on:

- PDF text
- Section detection
- Pattern matching
- Keywords
- Structured parsing

Complex resume layouts may affect extraction quality.

---

## Research Verification

Research verification depends on external search results.

A successful search result should not automatically be interpreted as definitive proof of a publication identity without checking relevant fields such as:

- Title
- Year
- Venue
- Other identifying metadata

---

## Evidence Interpretation

Evidence availability is not the same as ability.

For example:

```text
No GitHub evidence
```

does not mean:

```text
Candidate cannot code.
```

It means:

```text
The system did not find the expected evidence source.
```

---

## Role Matching

Role matching is an evolving system.

Different matching signals may use different methodologies, and scores should not automatically be interpreted as objective employability measurements.

---

## Authentication

The current candidate and recruiter entry experiences are prototype flows and do not represent a production authentication system.

---

## Resume Improver

The current Resume Improver experience contains prototype interactions and should not be interpreted as a complete production resume-editing system.

---

## Recruiter Analytics

Some recruiter intelligence and ranking behavior remains prototype-oriented and should not be treated as a production hiring decision system.

---

# 30. Future Roadmap

## Phase 1 — Evidence Intelligence

- Improved claim extraction
- Better evidence matching
- Source provenance
- Confidence-aware verification
- Better cross-source consistency analysis

---

## Phase 2 — Research Verification

- Title similarity scoring
- Year validation
- Venue validation
- Multiple-source verification
- False-positive reduction
- Better research provenance

---

## Phase 3 — Career Intelligence

- Personalized career recommendations
- Improved role matching
- Evidence-driven skill gaps
- Personalized learning paths
- Progress tracking

---

## Phase 4 — Resume Intelligence

- Evidence-grounded resume rewriting
- Claim-level suggestions
- Real resume editing
- Exportable optimized resumes
- Evidence-linked resume changes

---

## Phase 5 — Recruiter Intelligence

- Explainable candidate ranking
- Role-specific candidate matching
- Persistent shortlists
- Candidate comparison
- Evidence-based recruiter analytics

---

## Phase 6 — Platform

- Real authentication
- Persistent user accounts
- Production database architecture
- Privacy controls
- Cloud deployment
- Real-world pilot deployment
- Structured user feedback
- Outcome-based product iteration

---

# 31. Responsible Use

ResumeRadar is designed to help interpret professional evidence, not make absolute judgments about people.

The system should not treat:

```text
No evidence found
```

as:

```text
Candidate cannot do this.
```

Similarly:

```text
Evidence found
```

does not automatically mean:

```text
Candidate is fully qualified.
```

The long-term goal is to make career intelligence:

- Evidence-based
- Explainable
- Transparent
- Actionable
- Privacy-conscious

The platform should use publicly observable or user-supplied information and clearly communicate limitations.

---

# 32. Team

## ResumeRadar

GitHub repository:

https://github.com/vaisnavisabarish/ResumeRadar

ResumeRadar is developed as a collaborative project focused on transforming traditional resume screening into an evidence-backed career intelligence workflow.

---

# Core Product Thesis

Traditional resume:

```text
"I know Python."
"I built a project."
"I conducted research."
"I have experience in machine learning."
```

ResumeRadar:

```text
"I know Python."
       │
       ▼
What evidence supports this?
       │
       ▼
Where did that evidence come from?
       │
       ▼
How strong is the evidence?
       │
       ▼
What is missing?
       │
       ▼
What should I do next?
```

## ResumeRadar turns a resume from a self-reported document into an evidence-backed career profile.