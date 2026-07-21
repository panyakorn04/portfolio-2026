# syntax=docker/dockerfile:1

FROM oven/bun:1.3.14-alpine@sha256:5acc90a93e91ff07bf72aa90a7c9f0fa189765aec90b47bdbf2152d2196383c0 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM base AS builder
ARG NEXT_PUBLIC_SITE_URL=https://panyakorn.com
ARG NEXT_PUBLIC_API_URL=
ARG NEXT_PUBLIC_POSTHOG_KEY=
ARG NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
ARG BUILD_API_BASE_URL=https://api.panyakorn.com
ARG FRONTEND_API_BASE_URL=http://backend:8888
ARG PORTFOLIO_API_TIMEOUT_MS=3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV BUILD_API_BASE_URL=$BUILD_API_BASE_URL
ENV FRONTEND_API_BASE_URL=$FRONTEND_API_BASE_URL
ENV PORTFOLIO_API_TIMEOUT_MS=$PORTFOLIO_API_TIMEOUT_MS
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/app/.next/cache \
    bun run build

FROM node:24-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS runner
WORKDIR /app

LABEL org.opencontainers.image.title="portfolio-2026" \
      org.opencontainers.image.description="Panyakorn Boonyong Portfolio" \
      org.opencontainers.image.source="https://github.com/panyakorn04/portfolio-2026" \
      org.opencontainers.image.version="${VERSION:-0.1.73}" \
      org.opencontainers.image.licenses="MIT"

ARG NEXT_PUBLIC_SITE_URL=https://panyakorn.com
ARG NEXT_PUBLIC_API_URL=
ARG NEXT_PUBLIC_POSTHOG_KEY=
ARG NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
ARG BUILD_API_BASE_URL=
ARG FRONTEND_API_BASE_URL=http://backend:8888
ARG PORTFOLIO_API_TIMEOUT_MS=3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV BUILD_API_BASE_URL=$BUILD_API_BASE_URL
ENV FRONTEND_API_BASE_URL=$FRONTEND_API_BASE_URL
ENV PORTFOLIO_API_TIMEOUT_MS=$PORTFOLIO_API_TIMEOUT_MS

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs && chown -R nextjs:nodejs /app

COPY --link --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:3000/robots.txt').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]

STOPSIGNAL SIGTERM

CMD ["node", "server.js"]