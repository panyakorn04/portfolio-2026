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
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/portfolio?schema=public
NEXT_PUBLIC_SITE_URL=https://your-domain.com
CONTACT_WEBHOOK_URL=
CONTACT_WEBHOOK_SECRET=
```

Generate Prisma Client after installing dependencies:

```bash
pnpm prisma:generate
```

Verified local database workflow for this repo:

```bash
pnpm db:start
pnpm db:status
# copy the TCP DATABASE_URL printed by Prisma Dev into .env.local
pnpm db:sync
```

Production database workflow for this repo:

```bash
pnpm prisma:generate
pnpm db:migrate:deploy
```

## Starter backend

This repo now includes a small backend-for-frontend layer using Next.js Route Handlers and Prisma 7.

Available endpoints:

```text
GET  /api/health
GET  /api/articles?lang=en&limit=2
GET  /api/articles/[slug]?lang=th
POST /api/contact
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

`POST /api/contact` validates the payload and:

- stores the inquiry in PostgreSQL via Prisma
- forwards the submission to your webhook when `CONTACT_WEBHOOK_URL` is set

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

Admin auth bootstrap:

```text
pnpm auth:create-admin --email admin@example.com --password your-password --name "Admin"
pnpm auth:create-user --email editor@example.com --password your-password --name "Editor" --role editor
```

The browser admin UI now uses database-backed sessions. `ADMIN_API_TOKEN` can still remain for scripts and automation.

Local database commands:

```bash
pnpm db:start   # starts Prisma Dev Postgres locally
pnpm db:status  # prints DATABASE_URL and server status
pnpm db:sync    # pushes the schema to the configured database
pnpm db:migrate:deploy # applies committed Prisma migrations, intended for production/staging
pnpm db:stop    # stops the Prisma Dev server
```

Production preparation commands:

```bash
pnpm env:check      # verifies required env vars exist
pnpm deploy:prepare # prisma generate + migrate deploy + production build
```

## Contact form flow

The portfolio contact section now includes a live form wired to `POST /api/contact`.

Runtime flow:

```text
Visitor submits form
→ Next.js Route Handler validates request
→ Prisma saves inquiry to PostgreSQL
→ Optional webhook forwards the same payload
→ UI shows success or error state
```

Notes:

- The local setup above was verified in this repo with `prisma dev` plus `prisma db push`.
- Local bootstrap is still `db:sync`, while production/staging should use committed migrations via `db:migrate:deploy`.

## Production check

```bash
pnpm lint
pnpm build
```

## CI/CD

This repository includes GitHub Actions workflows:

```text
.github/workflows/ci.yml                  # Runs lint + production build
.github/workflows/deploy-hostinger.yml    # Deploys to Hostinger over SSH after CI passes
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

### CD behavior for Hostinger

The deploy workflow runs when the `CI` workflow on `main` succeeds. It can also be triggered manually from GitHub Actions using **Run workflow**.

Add these GitHub repository secrets before enabling deployment:

| Secret | Example | Required |
|---|---|---|
| `HOSTINGER_HOST` | `123.123.123.123` or `your-server.hostinger.com` | Yes |
| `HOSTINGER_USERNAME` | `u123456789` | Yes |
| `HOSTINGER_SSH_KEY` | Private SSH key with access to Hostinger | Yes |
| `HOSTINGER_PORT` | `65002` or `22` | Optional |
| `HOSTINGER_PROJECT_PATH` | `/home/u123456789/domains/example.com/portfolio` | Yes |
| `HOSTINGER_RESTART_COMMAND` | `pm2 reload portfolio` | Optional |

The deployment script runs on Hostinger:

```bash
cd "$HOSTINGER_PROJECT_PATH"
git fetch origin main
git reset --hard origin/main
pnpm install --frozen-lockfile
pnpm deploy:prepare
# then runs HOSTINGER_RESTART_COMMAND, or falls back to pm2 if available
```

> If you use Hostinger's built-in **Node.js App → Import Git Repository** deployment, you may not need `deploy-hostinger.yml`. In that setup, keep `ci.yml` for quality checks and let Hostinger auto-deploy from `main`.

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

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Keep the default build command:

```bash
pnpm deploy:prepare
```

4. Keep the default output settings for Next.js.
5. Add production environment variables:

```text
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
CONTACT_WEBHOOK_URL=
CONTACT_WEBHOOK_SECRET=
ADMIN_API_TOKEN=
INTERNAL_API_TOKEN=
AI_PROVIDER=stub
AI_API_KEY=
```

6. After the first successful deploy, create the first admin user:

```bash
pnpm auth:create-admin --email admin@example.com --password your-password --name "Admin"
```

7. Add the final Vercel/custom domain URL back into the resume and portfolio contact links.

## Deploying to Hostinger

Recommended Hostinger settings for this Next.js app:

```text
Type: Node.js App
Source: Import GitHub Repository
Branch: main
Node.js version: 22.x or 24.x
Install command: pnpm install --frozen-lockfile
Build command: pnpm deploy:prepare
Start command: pnpm start
Output directory: .next
```

After the first deploy on Hostinger, create the first admin user on the server:

```bash
cd "$HOSTINGER_PROJECT_PATH"
pnpm auth:create-admin --email admin@example.com --password your-password --name "Admin"
```

## When To Split The Backend

Keeping the backend inside this Next.js app is a good fit right now for portfolio content, article APIs, and the contact workflow.

Consider splitting to a dedicated backend service when you need several of these at once:

- Auth with sessions, roles, refresh-token rotation, or third-party identity flows
- Admin tools with audit logs, permission boundaries, and internal-only APIs
- Queues, workers, cron jobs, or long-running background processing
- Webhook ingestion that needs retries, signatures, dead-letter handling, or high throughput
- AI pipelines that orchestrate jobs, embeddings, vector storage, tool execution, or async post-processing

If the project reaches that stage, a practical next step is:

- Keep the Next.js app as frontend + BFF
- Move heavy domain logic to a separate service
- Let Prisma and PostgreSQL stay as shared infrastructure, or split databases later when boundaries are clear

## In-Repo Expansion Baseline

The repo now includes a server baseline under [src/server/README.md](/Users/panyakornboonyong/portfolio/src/server/README.md) so auth, admin, jobs, webhooks, and AI flows can grow without splitting the repo yet.

Suggested env vars for these capabilities:

```text
ADMIN_API_TOKEN=...
INTERNAL_API_TOKEN=...
AI_PROVIDER=stub
AI_API_KEY=
```
