import { existsSync } from "node:fs";

type Environment = {
  databaseUrl: string | null;
  directUrl: string | null;
  siteUrl: string | null;
  contactWebhookUrl: string | null;
  contactWebhookSecret: string | null;
  adminApiToken: string | null;
  internalApiToken: string | null;
  aiApiKey: string | null;
  aiProvider: string | null;
};

function loadEnvFiles() {
  if (existsSync(".env")) {
    process.loadEnvFile?.(".env");
  }

  if (existsSync(".env.local")) {
    process.loadEnvFile?.(".env.local");
  }
}

function readValue(key: string) {
  const value = process.env[key]?.trim();
  return value ? value : null;
}

loadEnvFiles();

export function getEnvironment(): Environment {
  return {
    databaseUrl: readValue("DATABASE_URL"),
    directUrl: readValue("DIRECT_URL"),
    siteUrl: readValue("NEXT_PUBLIC_SITE_URL"),
    contactWebhookUrl: readValue("CONTACT_WEBHOOK_URL"),
    contactWebhookSecret: readValue("CONTACT_WEBHOOK_SECRET"),
    adminApiToken: readValue("ADMIN_API_TOKEN"),
    internalApiToken: readValue("INTERNAL_API_TOKEN"),
    aiApiKey: readValue("AI_API_KEY"),
    aiProvider: readValue("AI_PROVIDER"),
  };
}

export function requireEnvironmentValue(
  key: keyof ReturnType<typeof getEnvironment>,
  message: string,
) {
  const value = getEnvironment()[key];

  if (!value) {
    throw new Error(message);
  }

  return value;
}
