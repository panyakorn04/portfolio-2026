import { existsSync } from "node:fs";

import { defineConfig } from "prisma/config";

if (existsSync(".env")) {
  process.loadEnvFile?.(".env");
}

if (existsSync(".env.local")) {
  process.loadEnvFile?.(".env.local");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma CLI (migrate/db push/studio) connects directly.
    // With a connection pooler like Supabase, point DIRECT_URL at the
    // direct connection (port 5432); falls back to DATABASE_URL otherwise.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
