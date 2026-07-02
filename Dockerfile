# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
ARG NEXT_PUBLIC_SITE_URL=https://panyakorn.com
ARG NEXT_PUBLIC_API_URL=https://api.panyakorn.com
ARG BUILD_API_BASE_URL=https://api.panyakorn.com
ARG FRONTEND_API_BASE_URL=http://backend:8888
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV BUILD_API_BASE_URL=$BUILD_API_BASE_URL
ENV FRONTEND_API_BASE_URL=$FRONTEND_API_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_PUBLIC_SITE_URL=https://panyakorn.com
ENV NEXT_PUBLIC_API_URL=https://api.panyakorn.com
ENV FRONTEND_API_BASE_URL=http://backend:8888

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
