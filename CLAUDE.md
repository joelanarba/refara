# CLAUDE.md — Refara

## Project Overview
Refara is a web-based Maternal Referral Management and Tracking System that digitizes maternal referrals between Ghanaian healthcare facilities (CHPS compounds, health centers, district/regional/teaching hospitals, private clinics). It replaces fragmented, manual referral tracking with a centralized, auditable workflow.

Scope is deliberately narrow: the referral workflow and coordination between facilities, not a full EMR, not ambulance dispatch, not clinical decision support. This is a **10-day MVP**. When in doubt, cut scope rather than add it — see "Out of Scope" below before building anything not listed.

Full original requirements: keep the source SRS at `docs/SRS.md` for reference. This file is the operational guide — it resolves every ambiguity the SRS left open so the build doesn't stall on decisions mid-sprint.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT (access token, ~8h expiry), bcrypt password hashing
- **Deployment:** AWS — RDS (Postgres), Elastic Beanstalk or a single EC2 instance for the API, S3 + CloudFront for the static frontend

Don't swap any of these without asking first — they're load-bearing for everything below.

## Repo Structure
```
/frontend                React app (Vite)
/backend
  /src
    /routes
    /controllers
    /middleware           auth, role check, facility-scoping
    /services
  /prisma
    schema.prisma
/docs
  SRS.md
/tasks
  todo.md
  lessons.md
```

## Commands
- `npm install` — run in both `/frontend` and `/backend`
- `npm run dev` — start dev servers
- `npx prisma migrate dev` — apply schema changes
- `npx prisma studio` — inspect the database
- `npm test` — backend tests (Jest + Supertest)

## Domain Model

**Roles:** `REFERRING_WORKER` | `RECEIVING_WORKER` | `ADMIN`
A user has exactly one role and belongs to exactly one facility (admins may be facility-less).

**Facility type (enum):** `CHPS_COMPOUND | HEALTH_CENTER | DISTRICT_HOSPITAL | REGIONAL_HOSPITAL | TEACHING_HOSPITAL | PRIVATE_CLINIC`

**Referral urgency (enum):** `ROUTINE | URGENT | EMERGENCY`

**Referral status — state machine:**
```
SUBMITTED → ACKNOWLEDGED → ACCEPTED → ARRIVED → COMPLETED
                 ↓
             REJECTED        (terminal, requires reasonText)
SUBMITTED/ACKNOWLEDGED → CANCELLED   (terminal, requires reasonText;
                                      referring worker or admin only,
                                      only before ACCEPTED)
```
Enforce every transition server-side. Reject any request that skips a state or tries to move a terminal referral (`REJECTED`, `CANCELLED`, `COMPLETED`).

**"Delayed"** (used in the admin dashboard stat) = no status change within a constant `DELAYED_THRESHOLD_HOURS` (default 4) of the referral's last update. Keep it as a named constant, not a magic number, so it's easy to tune per urgency level later.

### Entities (Prisma-level)
- **User** — id, name, email (unique), passwordHash, role, facilityId (nullable), createdAt
- **Facility** — id, name, type, location, createdAt
- **Referral** — id, patientName, patientAge, gestationalWeeks (nullable), reason, urgency, status, referringFacilityId, receivingFacilityId, createdAt, updatedAt
- **ReferralStatusHistory** — id, referralId, previousStatus, newStatus, changedByUserId, reasonText (nullable — populated for REJECTED/CANCELLED), timestamp

## Access Control (non-negotiable)
- A `REFERRING_WORKER` only sees referrals where `referringFacilityId` matches their own facility.
- A `RECEIVING_WORKER` only sees referrals where `receivingFacilityId` matches their own facility.
- `ADMIN` sees everything.
- Enforce this in middleware on every referral-fetching route — never rely on the frontend to hide what the API already returned. This is patient health data crossing facility boundaries; treat the isolation requirement as a security requirement, not a UX nicety.

## Decisions Already Made (don't re-litigate without asking)
These resolve gaps the original SRS left open. They're deliberate scope cuts for a 10-day build, not oversights:
- **No self-registration.** Admins create user accounts directly. Password reset is out of scope for the MVP — a fast-follow, not a blocker.
- **No draft state.** Creating a referral submits it immediately (`SUBMITTED`), matching the SRS workflow diagram literally.
- **Rejection and cancellation both require `reasonText`** and are both terminal. There's no auto-resubmission chain — a referring worker who gets a rejection creates a fresh referral to a different facility by hand.
- **Patient info is structured** (name, age, gestational weeks, reason) rather than one free-text blob, so receiving facilities have something to triage on.

## Working Agreement
- Plan non-trivial changes in `tasks/todo.md` before implementing; check in before starting.
- Don't mark anything done without proof it works — run it, don't just read the code.
- Log corrections in `tasks/lessons.md` as they happen.
- Keep changes minimal and root-cause; no temporary patches.
- Ask before touching the stack, the state machine, or the access-control rules above.

## Out of Scope for MVP
Ambulance dispatch, GPS/live location, AI clinical decision support, full EMR, SMS/push notifications, DHIS2/OpenMRS integration, offline-first sync, advanced analytics.
