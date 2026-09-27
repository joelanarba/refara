# Architecture

## System Overview

Refara follows a simple three-tier architecture:

```
┌─────────────────────┐
│   React Frontend    │    Single-page application
│   (Vite + TS)       │    Served via static hosting
└────────┬────────────┘
         │ HTTP/REST
         ▼
┌─────────────────────┐
│   Express Backend   │    REST API server
│   (Node.js + TS)    │    JWT authentication
└────────┬────────────┘
         │ Prisma ORM
         ▼
┌─────────────────────┐
│    PostgreSQL       │    Primary data store
└─────────────────────┘
```

## Frontend Architecture

The frontend is organized by **feature** to minimize merge conflicts:

```
frontend/src/
├── components/       # Shared, reusable UI components
│   ├── common/       # Buttons, modals, badges, etc.
│   ├── forms/        # Form inputs, select fields, etc.
│   ├── layout/       # Header, sidebar, page layouts
│   └── ui/           # Design system primitives
├── features/         # Feature-specific components and logic
│   ├── auth/         # Login page, auth context
│   ├── referrals/    # Referral creation, list, detail
│   ├── facilities/   # Facility management
│   └── dashboard/    # Admin dashboard, statistics
├── hooks/            # Custom React hooks
├── services/         # API client and service functions
├── types/            # Shared TypeScript types/interfaces
├── utils/            # Helper functions
├── routes/           # Route definitions
└── constants/        # App-wide constants
```

## Backend Architecture

The backend uses a **modular** structure where each feature module contains its own controller, service, repository, routes, validation, and types:

```
backend/src/
├── config/           # Environment and app configuration
├── middleware/       # Auth, error handling, request logging
├── modules/          # Feature modules
│   ├── auth/         # Authentication (login, JWT)
│   ├── users/        # User management
│   ├── facilities/   # Facility CRUD
│   ├── referrals/    # Referral workflow
│   └── dashboard/    # Statistics and reporting
├── types/            # Shared TypeScript types
└── utils/            # Shared utility functions
```

Each module follows this internal structure:

```
modules/referrals/
├── referral.controller.ts    # HTTP request/response handling
├── referral.service.ts       # Business logic
├── referral.repository.ts    # Database queries (via Prisma)
├── referral.routes.ts        # Route definitions
├── referral.validation.ts    # Input validation schemas
└── referral.types.ts         # Module-specific types
```

## Data Flow

```
HTTP Request
    → Router
    → Middleware (auth, validation)
    → Controller (parse request)
    → Service (business logic)
    → Repository (database query)
    → Response
```

## Authentication

- **JWT-based** authentication with access tokens
- Passwords hashed with **bcrypt**
- Auth middleware validates JWT on protected routes
- Role-based middleware restricts access per endpoint
- Facility-scoped data filtering enforced server-side

## Database

- **PostgreSQL** as the primary data store
- **Prisma ORM** for type-safe database access and migrations
- Four core entities: `User`, `Facility`, `Referral`, `ReferralStatusHistory`

## Deployment (Planned)

- **Frontend:** S3 + CloudFront (static hosting)
- **Backend:** Elastic Beanstalk or EC2
- **Database:** AWS RDS (PostgreSQL)
