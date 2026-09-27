# Refara

**Maternal Referral Management and Tracking System**

## Overview

Refara is a web-based platform for managing and tracking maternal referrals between healthcare facilities in Ghana. It replaces fragmented, manual referral tracking with a centralized, auditable digital workflow — enabling referring facilities (CHPS compounds, health centers) to create structured referrals and receiving facilities (district, regional, and teaching hospitals) to acknowledge, accept, and track patient arrivals.

## Core Workflow

```
Create Referral → Submit → Acknowledge → Accept → Patient Arrived → Completed
```

Referrals can also be **Rejected** (by receiving facility, with reason) or **Cancelled** (by referring worker or admin, before acceptance).

## User Roles

| Role | Description |
|------|-------------|
| **Referring Healthcare Worker** | Creates and submits maternal referrals from their facility |
| **Receiving Healthcare Worker** | Acknowledges, accepts/rejects, and tracks incoming referrals |
| **Administrator** | Manages facilities, user accounts, and views system-wide dashboards |

## MVP Features

- Authentication and role-based access control
- Facility management
- Maternal referral creation and submission
- Incoming referral management (acknowledge, accept, reject)
- Referral status tracking
- Referral history and audit trail
- Basic administrative dashboard
- Basic referral statistics

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, TypeScript, Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT, bcrypt |
| Deployment | AWS (planned) |

## Repository Structure

```
refara/
├── frontend/          # React application (Vite)
├── backend/           # Express API server
├── docs/              # Architecture and API documentation
├── .github/           # GitHub workflows and templates
├── .gitignore
├── .editorconfig
├── .prettierrc
├── README.md
└── CONTRIBUTING.md
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- PostgreSQL >= 14

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/refara.git
cd refara
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set Up Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your PostgreSQL connection string and JWT secret:

```
DATABASE_URL=postgresql://user:password@localhost:5432/refara
JWT_SECRET=your-secret-key-change-in-production
```

### 4. Set Up the Database

```bash
# Make sure PostgreSQL is running, then:
cd backend
npx prisma migrate dev --name init
```

### 5. Start the Backend

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3000`.

Verify with: `GET http://localhost:3000/api/v1/health`

### 6. Start the Frontend

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/refara` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api/v1` |

## Development Workflow

```
Create Issue → Create Feature Branch → Develop → Run Tests/Lint → Open PR → Code Review → Merge
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Branch Naming

```
feature/auth-login
feature/create-referral
feature/referral-tracking
fix/login-validation
docs/api-documentation
```

### Commit Convention

```
feat: add referral creation form
fix: correct status transition validation
refactor: extract auth middleware
docs: update API documentation
test: add referral service tests
chore: update dependencies
```

## Available Scripts

### Backend (`cd backend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without modifying files |

### Frontend (`cd frontend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without modifying files |

