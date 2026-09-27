# Contributing to Refara

Thank you for contributing to Refara! This guide will help you get started.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/refara.git
   cd refara
   ```

2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Set up environment variables:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. Set up the database:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

5. Start the development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Branch Naming Convention

Always create a new branch from `main`:

```bash
git checkout main
git pull origin main
git checkout -b <type>/<short-description>
```

Branch types:

| Prefix | Use Case |
|--------|----------|
| `feature/` | New features (e.g., `feature/auth-login`) |
| `fix/` | Bug fixes (e.g., `fix/login-validation`) |
| `docs/` | Documentation changes (e.g., `docs/api-docs`) |
| `refactor/` | Code refactoring (e.g., `refactor/auth-middleware`) |
| `test/` | Adding or updating tests (e.g., `test/referral-service`) |

## Commit Convention

Use conventional commit messages:

```
<type>: <short description>
```

Types:
- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code refactoring (no functional change)
- `docs:` — Documentation only
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks (dependencies, config)

**Examples:**
```
feat: add referral creation endpoint
fix: prevent duplicate referral submission
refactor: extract validation into middleware
docs: document referral API endpoints
test: add unit tests for auth service
chore: update Prisma to v6
```

## Before Opening a Pull Request

1. **Run linting:**
   ```bash
   cd backend && npm run lint
   cd ../frontend && npm run lint
   ```

2. **Run formatting check:**
   ```bash
   cd backend && npm run format:check
   cd ../frontend && npm run format:check
   ```

3. **Ensure the project builds:**
   ```bash
   cd backend && npm run build
   cd frontend && npm run build
   ```

## Pull Request Guidelines

1. **Link your PR to a GitHub Issue.** Every PR should reference an issue.
2. **Fill out the PR template** — describe what changed, why, and how you tested it.
3. **Keep PRs focused** — one feature or fix per PR.
4. **Request a review** from at least one team member.
5. **Don't merge your own PR** unless it's a trivial documentation fix.

## Code Style

- Code formatting is handled by **Prettier** — run `npm run format` before committing.
- Linting rules are enforced by **ESLint** — run `npm run lint` to check.
- Use **TypeScript** for all source files.
- Follow the existing project structure — see the README for directory layout.

## Questions?

If you're unsure about anything, open an issue or ask the team before starting work.
