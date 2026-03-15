# Prodexa — AI-Powered Project Productivity Dashboard

---

## Author

**Abdul Rehman**
BS Computer Science — Final Year Project
Supervisor: `<Supervisor Name>`

---

> Final Year Project (FYP) | BS Computer Science
> An intelligent, automated platform for tracking software project productivity using GitHub data and Machine Learning.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [ML Service Setup](#ml-service-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [ML Model Details](#ml-model-details)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [References](#references)

---

## Overview

**Prodexa** (Project Productivity Dashboard) is an AI-powered SaaS platform that helps software project managers and team leads monitor development progress in real time. It eliminates manual tracking by automatically collecting GitHub activity data — commits, pull requests, issues, and contributor statistics — and applying machine learning to generate actionable insights.

The platform provides:
- Real-time project health scores
- Developer productivity leaderboards
- ML-based delivery risk predictions
- In-app smart notifications and alerts
- Admin panel for user and project management

---

## Features

### Core Features
| Feature | Description |
|---|---|
| **GitHub OAuth** | Secure login via GitHub OAuth 2.0. No passwords needed. |
| **Project Tracking** | Connect any GitHub repository and track its activity automatically |
| **Developer Analytics** | Per-developer commits, PRs, issues and productivity scoring |
| **Background Queue** | BullMQ + Redis async job queue for non-blocking analysis |
| **ML Predictions** | Random Forest models predict productivity scores and delivery risk |
| **Interactive Dashboard** | Real-time KPIs, leaderboard, health scores, and risk indicators |
| **Notifications** | Smart in-app alerts for productivity drops, inactive devs, and risks |
| **Admin Panel** | Full user/project management with role-based access control |
| **Audit Logs** | All admin actions are logged for compliance and transparency |
| **Dark/Light Theme** | Full dark and light mode support with theme persistence |

### ML Capabilities
| Capability | Details |
|---|---|
| **Score Prediction** | Random Forest Regressor — MAE: 1.01 (out of 100) |
| **Risk Classification** | Random Forest Classifier — Accuracy: 98.8% |
| **Features Used** | commits, PRs, issues, commit/PR ratio, activity density, collaboration score |
| **Outputs** | predictedScore, deliveryRisk (Low/Medium/High), trend (improving/stable/declining) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     Next.js Frontend (3000)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP / REST API
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NestJS Backend (3001)                         │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │
│  │   Auth   │  │ Projects │  │ Dashboard │  │     Admin     │  │
│  │ (GitHub  │  │ GitHub   │  │ Analytics │  │  Audit Logs   │  │
│  │  OAuth)  │  │   API    │  │    ML     │  │ Notifications │  │
│  └──────────┘  └──────────┘  └───────────┘  └───────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         BullMQ Queue (Redis)                             │   │
│  │   analyzeProject → fetchGitHub → ML → saveDB → notify   │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────┬──────────────────────────────────────┬────────────────────┘
       │                                      │
       ▼                                      ▼
┌─────────────┐                    ┌──────────────────────┐
│  PostgreSQL │                    │  FastAPI ML Service  │
│  (Supabase) │                    │      (Port 5000)     │
│             │                    │                      │
│  Users      │                    │  /predict            │
│  Projects   │                    │  Random Forest       │
│  Activities │                    │  Regressor +         │
│  Predictions│                    │  Classifier          │
│  AuditLogs  │                    │  98.8% accuracy      │
│  Notifs     │                    └──────────────────────┘
└─────────────┘
```

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **NestJS** | v11 | Main REST API framework |
| **TypeScript** | v5 | Type-safe development |
| **Prisma ORM** | v6 | Database access and migrations |
| **PostgreSQL** | — | Relational database (hosted on Supabase) |
| **BullMQ** | v5 | Background job queue |
| **Redis** | v6+ | Queue broker |
| **Passport.js** | v0.7 | Authentication middleware |
| **JWT** | — | Token-based auth |
| **GitHub OAuth** | — | User authentication |
| **Axios** | v1 | GitHub API HTTP client |

### ML Service
| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.10+ | Runtime |
| **FastAPI** | latest | ML microservice framework |
| **scikit-learn** | latest | Random Forest models |
| **pandas** | latest | Data manipulation |
| **numpy** | latest | Numerical computing |
| **joblib** | latest | Model serialization |
| **uvicorn** | latest | ASGI server |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | v16 | React framework with App Router |
| **React** | v19 | UI library |
| **TypeScript** | v5 | Type safety |
| **Tailwind CSS** | v4 | Utility-first styling |

---

## Database Schema

```
User
├── id (UUID, PK)
├── name
├── email (unique)
├── githubToken
├── role (ADMIN | MANAGER)
├── isActive
├── createdAt / updatedAt
└── → projects[], auditLogs[], notifications[]

Project
├── id (UUID, PK)
├── name
├── repoUrl
├── ownerName
├── status (ACTIVE | INACTIVE)
├── userId (FK → User)
└── → metrics[], predictions[], developerActivities[], notifications[]

DeveloperActivity
├── id (UUID, PK)
├── projectId (FK → Project)
├── developerLogin
├── commits
├── pullRequestCount
├── issueCount
├── productivityScore
├── predictedScore (from ML)
├── activityTimestamp
└── [UNIQUE: developerLogin + projectId]

ProjectActivity
├── id (UUID, PK)
├── projectId (FK → Project)
├── commitFrequency
├── pullRequestCount
├── issueCount
├── contributorCount
├── productivityScore
└── activityTimestamp

Prediction
├── id (UUID, PK)
├── projectId (FK → Project)
├── productivityScore (Float)
├── deliveryRisk (Low | Medium | High)
├── workloadForecast
└── generatedAt

AuditLog
├── id (UUID, PK)
├── userId (FK → User)
├── action
├── targetType
├── targetId
├── metadata (JSON)
└── createdAt

Notification
├── id (UUID, PK)
├── userId (FK → User)
├── projectId (FK → Project, optional)
├── type (PRODUCTIVITY_DROP | HIGH_DELIVERY_RISK | INACTIVE_DEVELOPER | ANALYSIS_COMPLETE | SYSTEM_ALERT)
├── title
├── message
├── isRead
└── createdAt
```

---

## Project Structure

```
Prodexa/
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── auth/                     # GitHub OAuth + JWT
│   │   ├── user/                     # User management
│   │   ├── project/                  # Project CRUD + analysis
│   │   ├── github/                   # GitHub API integration
│   │   ├── developer-analytics/      # Per-developer scoring
│   │   ├── intelligence/             # ML prediction logic
│   │   ├── dashboard/                # Unified dashboard data
│   │   ├── analytics-queue/          # BullMQ job queue
│   │   ├── ml/                       # FastAPI ML service caller
│   │   ├── ml-data/                  # Training data endpoints
│   │   ├── admin/                    # Admin CRUD + audit logs
│   │   ├── notifications/            # In-app notification system
│   │   ├── common/
│   │   │   ├── filters/              # Global exception handler
│   │   │   ├── guards/               # AdminGuard
│   │   │   └── interceptors/         # AuditLog interceptor
│   │   ├── prisma/                   # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── ml-service/                       # FastAPI ML Microservice
│   ├── main.py                       # FastAPI app entry point
│   ├── routers/
│   │   ├── routes.py                 # API endpoints
│   │   └── predictor.py              # Prediction logic
│   ├── schemas/
│   │   └── predict.py                # Pydantic schemas
│   ├── training/
│   │   └── train.py                  # Model training script
│   ├── models/                       # Saved .pkl model files
│   └── requirements.txt
│
└── frontend/                         # Next.js Frontend
    ├── app/
    │   ├── page.tsx                  # Login page
    │   ├── dashboard/page.tsx        # Token handler + redirect
    │   ├── projects/
    │   │   ├── page.tsx              # Projects list
    │   │   └── [projectId]/page.tsx  # Project dashboard
    │   ├── notifications/page.tsx    # Notifications
    │   └── admin/page.tsx            # Admin panel
    ├── components/
    │   └── layout/Sidebar.tsx        # Sidebar + theme toggle
    ├── lib/api.ts                    # API client
    └── types/index.ts                # TypeScript types
```

---

## Getting Started

### Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| Python | 3.10+ | https://python.org |
| Redis | 6.2+ | https://redis.io |
| Git | any | https://git-scm.com |

Also required:
- A **GitHub account** with OAuth App credentials
- A **Supabase** account (free tier) for PostgreSQL

---

### Backend Setup

```bash
# 1. Navigate to backend folder
cd prodexa/backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Fill in your values (see Environment Variables section)

# 4. Run database migrations
npx prisma migrate dev

# 5. Generate Prisma client
npx prisma generate

# 6. Start Redis (required for job queue)
redis-server
# OR with Docker:
docker run -d -p 6379:6379 redis

# 7. Start the backend
npm run dev
```

Backend runs on: `http://localhost:3001`

---

### ML Service Setup

```bash
# 1. Navigate to ml-service folder
cd prodexa/ml-service

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Train the Random Forest models
python training/train.py
# Expected output:
# ✅ Score Model MAE: ~1.0
# ✅ Risk Accuracy: ~98.8%

# 6. Start the ML service
python main.py
```

ML Service runs on: `http://localhost:5000`

---

### Frontend Setup

```bash
# 1. Navigate to frontend folder
cd prodexa/frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# 4. Start the frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

### Running All Services Together

Open **3 separate terminals**:

```bash
# Terminal 1 — Backend
cd prodexa/backend && npm run dev

# Terminal 2 — ML Service
cd prodexa/ml-service && venv\Scripts\activate && python main.py

# Terminal 3 — Frontend
cd prodexa/frontend && npm run dev
```

Then visit: `http://localhost:3000`

---

## Environment Variables

### Backend `.env`

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

# GitHub OAuth App (create at github.com/settings/developers)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# GitHub Personal Access Token (for API calls)
GITHUB_TOKEN=your_github_pat

# JWT Secret (use a long random string)
JWT_SECRET=your_super_secret_key_min_32_chars

# App URLs
FRONTEND_URL=http://localhost:3000
BACKEND_PORT=3001

# ML Service
ML_SERVICE_URL=http://localhost:5000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/auth/github` | None | Redirect to GitHub OAuth |
| GET | `/auth/github/callback` | None | OAuth callback handler |

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/projects` | JWT | Create a new project |
| GET | `/projects` | JWT | List user's projects |
| POST | `/projects/:id/analyze` | JWT | Queue GitHub analysis |
| GET | `/projects/:id/health` | JWT | Project health score |
| GET | `/projects/:id/leaderboard` | JWT | Developer leaderboard |
| GET | `/projects/:id/risk` | JWT | Developer risk report |
| GET | `/projects/:id/summary` | JWT | Trend + risk summary |

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/project/:id` | JWT | Full unified dashboard |
| GET | `/dashboard/project/:id/activity` | JWT | Activity timeline |
| GET | `/dashboard/project/:id/leaderboard` | JWT | Leaderboard data |

### ML Service
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/ml/project/:id/analyze` | JWT | Run ML prediction |
| GET | `/ml/health` | None | Check ML service status |
| POST | `http://localhost:5000/predict` | None | Direct ML prediction |
| GET | `http://localhost:5000/model-info` | None | Model details |

### Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | JWT | Get all notifications |
| GET | `/notifications/unread-count` | JWT | Unread badge count |
| PATCH | `/notifications/:id/read` | JWT | Mark as read |
| PATCH | `/notifications/read-all` | JWT | Mark all as read |
| DELETE | `/notifications/:id` | JWT | Delete notification |

### Admin (ADMIN role required)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/stats` | JWT+ADMIN | Platform overview |
| GET | `/admin/users` | JWT+ADMIN | All users |
| PATCH | `/admin/users/:id/role` | JWT+ADMIN | Change user role |
| PATCH | `/admin/users/:id/status` | JWT+ADMIN | Activate/deactivate |
| DELETE | `/admin/users/:id` | JWT+ADMIN | Soft delete user |
| GET | `/admin/projects` | JWT+ADMIN | All projects |
| PATCH | `/admin/projects/:id/status` | JWT+ADMIN | Update status |
| DELETE | `/admin/projects/:id` | JWT+ADMIN | Delete project |
| GET | `/admin/audit-logs` | JWT+ADMIN | Paginated audit logs |

---

## ML Model Details

### Models Used

**1. Random Forest Regressor** — Productivity Score Prediction
- Input features: commits, pullRequestCount, issueCount, commit_pr_ratio, activity_density, collaboration_score
- Output: predicted productivity score (0–100)
- Performance: MAE = 1.01 (extremely accurate)
- Training samples: 2,000

**2. Random Forest Classifier** — Delivery Risk Classification
- Same input features as above
- Output: Low / Medium / High delivery risk
- Performance: 98.8% accuracy
- Training samples: 2,000

### Feature Engineering

```python
commit_pr_ratio    = commits / (pullRequestCount + 1)
activity_density   = commits + pullRequestCount * 2 + issueCount * 0.5
collaboration_score = pullRequestCount * 3 + issueCount * 1.5
```

### Productivity Scoring Formula

```
productivityScore = commits × 0.5 + PRs × 0.3 + issues × 0.2
                  (capped between 0 and 100)
```

### Trend Detection

```
if predictedScore - currentScore > 5  → "improving"
if predictedScore - currentScore < -5 → "declining"
else                                   → "stable"
```

---

## Future Improvements

- **Email / Slack notifications** for critical alerts
- **Sprint-based tracking** (milestone-level analytics)
- **Code quality metrics** integration (SonarQube, CodeClimate)
- **Multi-repo projects** (monorepo support)
- **Team comparison** across multiple projects
- **Export reports** as PDF / CSV
- **CI/CD pipeline monitoring** (GitHub Actions integration)
- **Deployment on Vercel + Render + Supabase** (free tier)
- **Real-time updates** via WebSockets

---

## References

- GitHub REST API Documentation: https://docs.github.com/en/rest
- NestJS Documentation: https://docs.nestjs.com
- Prisma ORM Documentation: https://www.prisma.io/docs
- FastAPI Documentation: https://fastapi.tiangolo.com
- scikit-learn Documentation: https://scikit-learn.org/stable
- Next.js Documentation: https://nextjs.org/docs
- BullMQ Documentation: https://docs.bullmq.io
- WCAG 2.1 Accessibility Guidelines: https://www.w3.org/WAI/standards-guidelines/wcag

---

> Prodexa is built to demonstrate real-world full-stack engineering combining microservices architecture, AI/ML integration, async job processing, and modern frontend development — all within a single cohesive product.