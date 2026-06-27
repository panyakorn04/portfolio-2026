import { existsSync } from "node:fs";

if (existsSync(".env")) {
  process.loadEnvFile?.(".env");
}

if (existsSync(".env.local")) {
  process.loadEnvFile?.(".env.local");
}

const requiredEnv = ["DATABASE_URL", "NEXT_PUBLIC_SITE_URL"];
const missing = requiredEnv.filter((key) => {
  const value = process.env[key];
  return !value || value.trim().length === 0;
});

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (siteUrl?.includes("localhost")) {
  console.warn(
    "NEXT_PUBLIC_SITE_URL still points to localhost. Update it before deploying production.",
  );
}

if (process.env.CONTACT_WEBHOOK_SECRET && !process.env.CONTACT_WEBHOOK_URL) {
  console.warn(
    "CONTACT_WEBHOOK_SECRET is set without CONTACT_WEBHOOK_URL. Webhook forwarding will stay disabled.",
  );
}

console.log("Environment check passed.");
