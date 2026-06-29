# Panyakorn Boonyong Portfolio

Modern bilingual portfolio for Panyakorn Boonyong, built with Next.js, TypeScript, and Tailwind CSS.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Kanit font via `next/font/google`

## Local development

```bash
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3000
```

Environment variables:

```bash
cp .env.example .env.local
```

```text
NEXT_PUBLIC_SITE_URL=https://panyakorn.com
NEXT_PUBLIC_API_URL=https://api.panyakorn.com
FRONTEND_API_BASE_URL=https://api.panyakorn.com
```

For production on the VPS, `FRONTEND_API_BASE_URL` is set to `http://backend:8888` so server-rendered pages call the backend over the Docker network.

Do not set `DATABASE_URL`, `POSTGRES_*`, or `REDIS_URL` on the frontend service. Database credentials belong to the Go backend repository: `panyakorn04/portfolio-backend-2026`.

Generate Prisma Client after installing dependencies because a few legacy local/admin utilities still import Prisma types:

```bash
pnpm prisma:generate
```

## Backend API integration

Production frontend data is served by the separate Go backend at `https://api.panyakorn.com`. Caddy also routes `/api/*` on `panyakorn.com` to the backend.

Available public backend endpoints used by the frontend:

```text
GET  https://api.panyakorn.com/api/health
GET  https://api.panyakorn.com/api/articles?lang=en&limit=2
GET  https://api.panyakorn.com/api/articles/[slug]?lang=th
POST https://api.panyakorn.com/api/contact
```

Example contact payload:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "company": "Acme Studio",
  "subject": "Project inquiry",
  "message": "I would like to discuss a frontend and AI integration project.",
  "locale": "en"
}
```

`POST /api/contact` is handled by the backend API. The frontend form posts to `NEXT_PUBLIC_API_URL`, and the backend is responsible for validation, database persistence, and optional webhook delivery.

Additional in-repo server endpoints:

```text
GET  /api/admin/contact-inquiries      # protected by admin session or ADMIN_API_TOKEN
PATCH /api/admin/contact-inquiries/[id] # update status + internal note
GET  /api/admin/session                # check admin session
POST /api/admin/session               # login with admin email + password
DELETE /api/admin/session             # logout and clear session cookie
GET  /api/admin/sessions              # list current user's sessions
DELETE /api/admin/sessions            # logout everywhere
DELETE /api/admin/sessions/[id]       # revoke one session
GET  /api/admin/users                 # admin only: list users
PATCH /api/admin/users/[id]           # admin only: update role
POST /api/jobs/contact-follow-up       # protected by INTERNAL_API_TOKEN
POST /api/ai/contact-summary           # protected by admin session or ADMIN_API_TOKEN
```

Admin UI route:

```text
/en/admin
/th/admin
/en/admin/login
/th/admin/login
```

Admin workflow in this repo currently supports:

- signing in with a real admin user from PostgreSQL
- managing user roles (`admin`, `editor`, `viewer`)
- listing active sessions, revoking one session, and logging out everywhere
- browsing recent contact inquiries
- changing inquiry status (`new`, `in_progress`, `handled`)
- saving internal follow-up notes
- generating an AI summary for the selected inquiry

Admin/auth/contact storage is handled by the backend API in production. Backend user bootstrap and database migrations should be run from `panyakorn04/portfolio-backend-2026`, not from this frontend repo.

Production preparation commands:

```bash
pnpm env:check      # verifies frontend env vars exist
pnpm deploy:prepare # prisma generate + production build, no database migration
```

## Contact form flow

The portfolio contact section now includes a live form wired to `POST /api/contact`.

Runtime flow:

```text
Visitor submits form
→ Browser posts to NEXT_PUBLIC_API_URL/api/contact
→ Go backend validates request
→ Go backend saves inquiry to PostgreSQL
→ Optional backend webhook forwards the same payload
→ UI shows success or error state
```

Notes:

- Frontend containers must not receive database credentials.
- Database migrations and admin bootstrap belong to the backend repository.

## Production check

```bash
pnpm lint
pnpm build
```

## CI/CD

This repository includes GitHub Actions workflows:

```text
.github/workflows/ci.yml          # Runs lint + production build
.github/workflows/deploy-vps.yml  # Builds Docker image tar and deploys frontend to the VPS
```

### CI behavior

CI runs on:

- Pull requests into `main`
- Pushes to `main`

It executes:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

### CD behavior for VPS

The deploy workflow runs on every push to `main` and can also be triggered manually from GitHub Actions using **Run workflow**. It builds a Docker image tar, uploads it to the VPS, loads it with Docker, and restarts the `frontend` service in `/opt/apps/docker-compose.yml`.

GitHub repository secrets used by deployment:

| Secret | Example | Required |
|---|---|---|
| `VPS_HOST` | `76.13.185.117` | Yes |
| `VPS_USER` | `deploy` | Yes |
| `VPS_SSH_KEY` | Private SSH key with access to the VPS | Yes |
| `FRONTEND_IMAGE` | `ghcr.io/panyakorn04/portfolio-2026:latest` | Yes |

The VPS frontend service should receive only frontend env vars:

```text
NEXT_PUBLIC_SITE_URL=https://panyakorn.com
NEXT_PUBLIC_API_URL=https://api.panyakorn.com
FRONTEND_API_BASE_URL=http://backend:8888
```

## Content to update before publishing

- GitHub: https://github.com/panyakorn04
- LinkedIn: https://www.linkedin.com/in/eee-panyakorn-512b17304/
- Add custom domain after deployment
- Replace private project descriptions with approved screenshots or sanitized mockups if available
- Add measurable metrics / impact once confirmed

## Important files

```text
src/app/[lang]/page.tsx           # Localized portfolio page content
src/app/[lang]/layout.tsx         # Localized metadata and root layout
src/app/(root)/page.tsx           # Redirect from / to default locale
src/app/sitemap.ts                # Localized sitemap.xml output
src/app/robots.ts                 # robots.txt output
src/app/globals.css               # Global styles
public/assets/profile.png         # Profile photo extracted from resume
public/Panyakorn_Boonyong_Resume.pdf
```

## Deploying elsewhere

The current production target is the VPS at `76.13.185.117` behind Caddy. If you deploy this frontend elsewhere, keep the build command:

```bash
pnpm deploy:prepare
```

Required production env vars:

```text
NEXT_PUBLIC_SITE_URL=https://panyakorn.com
NEXT_PUBLIC_API_URL=https://api.panyakorn.com
FRONTEND_API_BASE_URL=https://api.panyakorn.com
```

Do not configure frontend database env vars.

## Backend split

The backend is already split to `panyakorn04/portfolio-backend-2026`. Use that repository for:

- database migrations
- admin user creation
- contact persistence
- article CRUD
- Redis/Postgres configuration
- backend API deployment

## In-Repo Expansion Baseline

The repo keeps a server baseline under `src/server/README.md` for legacy/local utilities and type references. Production API behavior lives in the backend repo.
