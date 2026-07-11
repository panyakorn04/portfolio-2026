import { existsSync } from "node:fs";

if (existsSync(".env")) {
  process.loadEnvFile?.(".env");
}

if (existsSync(".env.local")) {
  process.loadEnvFile?.(".env.local");
}

const requiredEnv = ["NEXT_PUBLIC_SITE_URL", "FRONTEND_API_BASE_URL"];
const missing = requiredEnv.filter((key) => {
  const value = process.env[key];
  return !value || value.trim().length === 0;
});

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

for (const key of ["DATABASE_URL", "DIRECT_URL", "POSTGRES_DB", "POSTGRES_USER", "POSTGRES_PASSWORD", "REDIS_URL"]) {
  if (process.env[key]?.trim()) {
    console.warn(`${key} is set but ignored by the frontend. Keep backend/database env in panyakorn04/portfolio-backend-2026.`);
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (siteUrl?.includes("localhost")) {
  console.warn(
    "NEXT_PUBLIC_SITE_URL still points to localhost. Update it before deploying production.",
  );
}

console.log("Environment check passed.");
