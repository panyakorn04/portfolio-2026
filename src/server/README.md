# Server Architecture

This repository keeps the backend inside the same Next.js app for now, but the server code is split by responsibility so it can grow without forcing an immediate repo split.

## Layout

```text
src/server/
  ai/         # AI prompts, provider selection, orchestration stubs
  articles/   # Read-side content services for article APIs
  auth/       # Access guards and token/session parsing
  contact/    # Contact submission business logic
  db/         # Prisma client and repository access
  env/        # Shared environment loading and access helpers
  http/       # Shared API response helpers
  jobs/       # Queue/enqueue abstractions and async workflow entrypoints
  webhooks/   # Outbound/inbound webhook helpers
```

## Current Route Mapping

```text
/api/articles                  -> src/server/articles
/api/contact                   -> src/server/contact + src/server/db + src/server/webhooks
/api/admin/session             -> src/server/auth + PostgreSQL-backed user/session login
/api/admin/contact-inquiries   -> src/server/auth + src/server/db
/api/admin/contact-inquiries/* -> src/server/auth + src/server/db
/api/jobs/contact-follow-up    -> src/server/auth + src/server/jobs
/api/ai/contact-summary        -> src/server/auth + src/server/ai + src/server/db
```

## Growth Path

- `auth`: current baseline now uses database-backed users and sessions; next step is identity provider integration, password reset, MFA, and richer RBAC.
- `admin`: add RBAC, audit logging, and internal UI surfaces against the same server modules.
- `jobs`: replace the in-process `enqueueJob` stub with a real queue such as BullMQ, SQS, or Cloud Tasks.
- `webhooks`: add inbound signature validation and retry-safe event processing.
- `ai`: connect provider clients, vector storage, and async task execution without changing route shape.

When traffic, security boundaries, or background processing needs outgrow the monolith, these folders become the extraction boundaries for separate services.
