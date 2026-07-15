# Panyakorn Boonyong — Portfolio 2026

[![CI](https://github.com/panyakorn04/portfolio-2026/actions/workflows/ci.yml/badge.svg)](https://github.com/panyakorn04/portfolio-2026/actions/workflows/ci.yml)
[![Deploy Frontend to VPS](https://github.com/panyakorn04/portfolio-2026/actions/workflows/deploy-vps.yml/badge.svg)](https://github.com/panyakorn04/portfolio-2026/actions/workflows/deploy-vps.yml)

Production portfolio and content experience for Panyakorn Boonyong. The site combines a bilingual editorial portfolio, backend-powered articles and contact workflows, a streaming AI assistant, and a backend-session-aware administration workspace.

เว็บไซต์พอร์ตโฟลิโอภาษาไทย–อังกฤษที่รวมผลงาน บทความ ระบบติดต่อ ผู้ช่วย AI แบบ streaming และพื้นที่ผู้ดูแล โดยแยก frontend ออกจาก backend และฐานข้อมูลอย่างชัดเจน

- Website: https://panyakorn.com
- English: https://panyakorn.com/en
- Thai: https://panyakorn.com/th
- Backend API: https://api.panyakorn.com
- Frontend repository: https://github.com/panyakorn04/portfolio-2026
- Backend repository: https://github.com/panyakorn04/portfolio-backend-2026

## What is included

- Localized English and Thai routes, metadata, legal pages, sitemap, and robots output
- Editorial portfolio sections for selected work, experience, skills, and the wider portfolio ecosystem
- Backend-driven article directory and localized article detail pages with five-minute revalidation
- Contact form with native form constraints, a server-action proxy, backend validation, and persistence
- Streaming portfolio assistant with recent conversations, backend sessions, and local-storage fallback
- Backend-session-aware admin workspace for inquiries, articles, sessions, and user management
- Visitor-to-human handoff with persisted chat sessions, status filtering, and admin replies
- Responsive navigation, loading/error/not-found states, accessible form controls, and optimized local assets
- Same-origin `/api/*` proxying to keep browser cookies and SSE traffic out of cross-origin CORS paths
- Immutable Docker image deployment to a VPS through GitHub Actions and GHCR
- Failure-only Agent Loop reporter that creates a GitHub issue and requests advisory analysis from `qwen2.5-coder:7b`

## Architecture

```text
Browser
  ├─ /en, /th, /articles, /admin
  └─ same-origin /api/*
            │
            ▼
portfolio-2026
Next.js 16 App Router
            │
            │ Next rewrite / Caddy proxy
            ▼
portfolio-backend-2026
Go API
            │
            ├─ Supabase/PostgreSQL
            ├─ Redis
            ├─ portfolio-site skill profile
            └─ Ollama
```

This repository is frontend-only. API behavior, authentication, persistence, migrations, Redis, and AI-provider integration belong to `panyakorn04/portfolio-backend-2026`.

## Technology

- Next.js 16 App Router with standalone output
- React 19 and TypeScript
- Tailwind CSS 4
- Bun 1.3.14
- Biome 2.5
- Radix UI primitives and class-variance-authority
- Kanit, Space Grotesk, and JetBrains Mono via `next/font/google`
- Docker Buildx, GHCR, Docker Compose, and Caddy
- GitHub Actions CI/CD and React Doctor PR analysis

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to the default locale |
| `/en`, `/th` | Localized portfolio home |
| `/[lang]/articles` | Localized article directory |
| `/[lang]/articles/[slug]` | Backend-powered article detail |
| `/[lang]/privacy` | Privacy policy |
| `/[lang]/terms` | Terms of use |
| `/[lang]/admin/login` | Admin sign-in |
| `/[lang]/admin` | Admin workspace; excluded from search indexing |
| `/sitemap.xml`, `/robots.txt` | Search-engine metadata |

## Local development

Requirements:

- Bun 1.3.14 or a compatible Bun 1.3 release
- Access to the public production API, or a locally running compatible backend

```bash
git clone https://github.com/panyakorn04/portfolio-2026.git
cd portfolio-2026
bun install --frozen-lockfile
cp .env.example .env.local
bun run dev
```

Open http://localhost:3000. The root route redirects to the default locale.

For a fresh development server that uses the live API without editing `.env.local`:

```bash
bun run dev:live-api
```

## Environment variables

`.env.example` contains the safe frontend configuration:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=
BUILD_API_BASE_URL=https://api.panyakorn.com
FRONTEND_API_BASE_URL=https://api.panyakorn.com
PORTFOLIO_API_TIMEOUT_MS=3000
```

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL and metadata base |
| `NEXT_PUBLIC_API_URL` | Optional browser-visible API base; intentionally empty for same-origin `/api/*` requests |
| `BUILD_API_BASE_URL` | First-priority base URL for server-side article reads whenever it is set; CI and Docker use it for prerendering |
| `FRONTEND_API_BASE_URL` | Server-side rewrite target; use the public API locally and `http://backend:8888` inside the VPS Compose network |
| `PORTFOLIO_API_TIMEOUT_MS` | Timeout for server-side portfolio API reads; defaults to 3000 ms |

Do not add database or backend secrets to this frontend. `scripts/check-env.mjs` warns when variables such as `DATABASE_URL`, `POSTGRES_*`, or `REDIS_URL` are present.

## API integration

Browser requests remain same-origin and are forwarded by Next.js during local development or by the production proxy stack.

Public functionality used by the site includes:

```text
GET    /api/health
GET    /api/articles?lang=en&limit=4
GET    /api/articles/[slug]?lang=th
POST   /api/contact
POST   /api/portfolio/assistant/chat/stream
POST   /api/portfolio/assistant/chat
GET    /api/portfolio/assistant/sessions/latest?locale=en
POST   /api/portfolio/assistant/sessions
DELETE /api/portfolio/assistant/sessions/[id]
POST   /api/portfolio/assistant/sessions/[id]/request-human
```

The assistant attempts streaming first and falls back to the non-streaming chat endpoint when necessary. Backend chat sessions are preferred; local storage remains a resilience fallback for recent conversations.

Admin components use the backend's `/api/admin/*` session, article, inquiry, chat-session, and user endpoints. The Chat tab loads persisted conversations, distinguishes AI, pending-human, and human-assisted states, and sends replies through `/api/admin/chat/sessions/[id]/reply`. The browser receives only a session cookie—no static backend admin token is embedded in this application.

## Contact flow

```text
Visitor submits the localized form
  → browser constraints check required fields and lengths
  → React server action forwards a normalized payload
  → POST /api/contact
  → Go backend validates and persists the inquiry
  → optional backend webhook delivery
  → localized success or error state
```

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the Next.js development server |
| `bun run dev:live-api` | Start development with the production API as the rewrite target |
| `bun test` | Run Bun tests |
| `bun run lint` | Run Biome checks |
| `bun run format` | Format supported files with Biome |
| `bun run build` | Create the production Next.js build |
| `bun run verify` | Run tests, lint, and production build |
| `bun run env:check` | Validate required frontend environment variables |
| `bun run deploy:prepare` | Validate environment variables and build |
| `bun run doctor` | Run React Doctor locally |

Canonical local verification:

```bash
bun run verify
git diff --check
```

The repository-managed pre-push hook runs `bun run lint` and `bun run build`. It is installed by the package `prepare` script when Git is available.

## CI and pull-request checks

### CI

`.github/workflows/ci.yml` runs on pull requests targeting `main`. Pushes to `main` are validated by the production workflow, avoiding a duplicate Next.js build:

```bash
bun install --frozen-lockfile
bun run lint
bun run test
bun run build
```

### React Doctor

`.github/workflows/react-doctor.yml` runs advisory React Doctor analysis for pull requests. It can publish a sticky summary, inline findings, and a commit status without blocking the pull request by default.

## Production deployment

`.github/workflows/deploy-vps.yml` runs on every push to `main` and through manual `workflow_dispatch`.

Deployment sequence:

1. Install dependencies, lint, and run tests.
2. Build the standalone Next.js application once inside the Docker Buildx image.
3. Push `latest`, the full commit SHA, and the short SHA to GHCR.
4. Run the exact image through its Docker health check and a `/robots.txt` HTTP probe.
5. Establish pinned-host-key SSH access to the VPS.
6. Pull the immutable image and recreate only the `frontend` Compose service.
7. Probe `https://panyakorn.com/th` until healthy.
8. Roll back to the previous image if the health gate fails.

Documentation, repository skills, hooks, and PR-only workflow changes do not trigger a production image rebuild.

Required GitHub Actions secrets:

```text
VPS_HOST
VPS_USER
VPS_SSH_KEY
VPS_KNOWN_HOSTS
```

The workflow uses the built-in short-lived `GITHUB_TOKEN` for GHCR access. No separate `FRONTEND_IMAGE` secret is required.

### VPS prerequisites

The repository does not contain the production Compose or Caddy configuration. Provision the target host before enabling deployment:

- Docker Engine and Docker Compose must be installed and available to `VPS_USER`.
- `flock` and `curl` must be installed.
- `/opt/apps/docker-compose.yml` must exist and define a service named `frontend`.
- The Compose network must provide the backend as `http://backend:8888`.
- `/opt/apps/.env` must be readable by `VPS_USER` without exposing it to other users; production uses `root:deploy` ownership with mode `640` so only root and the deploy group can read it.
- The deploy user must be able to create `/opt/apps/.production-deploy.lock` and run Docker commands.
- Caddy or an equivalent reverse proxy must terminate TLS, route the site, and make `https://panyakorn.com/th` reachable for the health gate.
- `VPS_KNOWN_HOSTS` must contain the pinned host key under the exact value stored in `VPS_HOST`; generate and verify that entry out of band before saving the secret.

These are externally managed infrastructure prerequisites, not resources created by this frontend repository.

Production frontend environment:

```dotenv
NEXT_PUBLIC_SITE_URL=https://panyakorn.com
NEXT_PUBLIC_API_URL=
BUILD_API_BASE_URL=https://api.panyakorn.com
FRONTEND_API_BASE_URL=http://backend:8888
PORTFOLIO_API_TIMEOUT_MS=3000
```

### Failure reporting

If `Build and deploy` fails, the dependent reporter job:

- queries completed failed jobs through the GitHub Actions API,
- retrieves job logs directly while the workflow is still active,
- filters actionable error lines,
- redacts common credential, signed-URL, GitHub-token, and JWT shapes,
- creates or updates the required labels and then creates or reuses a commit-scoped issue,
- asks `qwen2.5-coder:7b` for advisory root-cause analysis,
- validates the required response sections before posting the issue comment.

The redacted excerpt is sent over HTTPS to the public, unauthenticated `https://api.panyakorn.com/api/ai/chat` endpoint. GitHub's built-in masking and the reporter's redaction are defense in depth, not a guarantee that arbitrary command output is secret-free; workflow steps should never print credentials. The reporter does not modify code automatically. A human or coding agent reviews the issue, applies the smallest fix, and pushes a new commit; the deployment workflow then runs again.

## Project structure

```text
.github/
  scripts/report-deploy-failure.sh   Failure log collection and advisory AI report
  scripts/smoke-test-image.sh        Exact-image Docker health and HTTP gate
  workflows/                         CI, deploy, and React Doctor workflows
.githooks/pre-push                   Local lint/build gate
public/
  assets/profile.jpg                 Optimized profile image
  Panyakorn_Boonyong_Resume.pdf      Public résumé
scripts/check-env.mjs                Frontend environment validation
src/
  app/
    (root)/                           Root redirects and unlocalized legal redirects
    [lang]/                           Localized portfolio, articles, legal, and admin routes
      _components/                    Portfolio shell and lazy-loaded chat UI
      _hooks/                         Streaming chat and session state
      admin/_components/              Inquiries, articles, chat, sessions, and users UI
    dictionaries/                    English and Thai copy
    globals.css                      Global Tailwind theme and application styles
  components/                        Shared navigation, contact, legal, and UI primitives
  hooks/                             Shared browser hooks
  lib/                               Portfolio types/data, API reads, fonts, and site utilities
Dockerfile                           Multi-stage Bun build and non-root Node runtime
next.config.ts                       Standalone output, API rewrites, images, and security headers
```

## Security boundaries

- The frontend receives no database credentials, service-role keys, Redis URLs, or backend admin token.
- Browser API traffic defaults to same-origin `/api/*`.
- Admin authentication uses backend-managed sessions and cookies.
- Admin pages are marked `noindex, nofollow`.
- Security headers include CSP frame/object restrictions, HSTS, `nosniff`, referrer policy, and permissions policy.
- The production image runs as a non-root `nextjs` user.
- VPS deploy credentials and the GHCR token are not persisted by the workflow.

## Related repositories

- Backend API and persistence: https://github.com/panyakorn04/portfolio-backend-2026
- AI workflow studio: https://github.com/panyakorn04/ai-workflow-studio
- Custom AI skill profiles: https://github.com/panyakorn04/custom-ai-skills
- Custom AI console/theme: https://github.com/panyakorn04/open-webui-theme

## License

No open-source license is currently declared. All rights reserved unless the repository owner states otherwise.
