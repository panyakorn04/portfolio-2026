import { existsSync } from "node:fs";

if (existsSync(".env")) {
  process.loadEnvFile?.(".env");
}

if (existsSync(".env.local")) {
  process.loadEnvFile?.(".env.local");
}

const requiredEnv = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_API_URL"];
const missing = requiredEnv.filter((key) => {
  const value = process.env[key];
  return !value || value.trim().length === 0;
});

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

function validatePostgresUrl(key, rawValue) {
  const value = rawValue?.trim();

  if (!value) {
    return;
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    console.error(
      `${key} is not a valid URL. Make sure the value is wrapped in quotes in .env so the "&" between query parameters is not split.`,
    );
    process.exit(1);
  }

  if (!/^postgres(ql)?:$/.test(parsed.protocol)) {
    console.error(`${key} must use the postgres:// or postgresql:// scheme (got "${parsed.protocol}").`);
    process.exit(1);
  }

  if (!parsed.hostname || !parsed.hostname.includes(".")) {
    console.error(
      `${key} has a suspicious host "${parsed.hostname}". Expected a fully-qualified host such as aws-0-region.pooler.supabase.com. The value in .env is likely truncated.`,
    );
    process.exit(1);
  }
}

validatePostgresUrl("DIRECT_URL", process.env.DIRECT_URL);

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
