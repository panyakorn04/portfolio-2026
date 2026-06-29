# Server Architecture

This frontend repository keeps a few legacy Next.js route handlers and Prisma-backed utilities for local development/history, but production traffic for `/api/*` is handled by the separate Go backend repository: `panyakorn04/portfolio-backend-2026`.

## Production boundary

```text
Browser/frontend pages
→ NEXT_PUBLIC_API_URL=https://api.panyakorn.com
→ Go backend container (`backend:8888`)
→ PostgreSQL / Redis
```

The frontend container should not receive `DATABASE_URL`, `POSTGRES_*`, or `REDIS_URL`.

## Frontend API env

```text
NEXT_PUBLIC_SITE_URL=https://panyakorn.com
NEXT_PUBLIC_API_URL=https://api.panyakorn.com
FRONTEND_API_BASE_URL=http://backend:8888
```

- `NEXT_PUBLIC_API_URL` is used by browser-side requests such as the contact form.
- `FRONTEND_API_BASE_URL` is used by server-rendered pages and sitemap generation to call the backend over the Docker network.

## Legacy local modules

The folders below remain in the repo because some admin/local utilities and type definitions still reference them. They are not the production source of truth for API behavior.

```text
src/server/
  ai/         # AI prompt/provider stubs
  articles/   # Frontend read-side adapter that now calls the backend API
  auth/       # Legacy Next.js auth helpers
  contact/    # Legacy Next.js contact helpers
  db/         # Legacy Prisma repository access
  env/        # Shared environment loading helpers
  http/       # Shared API response helpers
  jobs/       # Legacy async workflow stubs
  webhooks/   # Legacy webhook helpers
```

For database migrations, admin user creation, contact persistence, article CRUD, and Redis/Postgres configuration, use the backend repository.
