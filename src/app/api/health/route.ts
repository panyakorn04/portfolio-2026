import { getPrismaClient } from "@/server/db/client";
import { getEnvironment } from "@/server/env";
import { jsonOk } from "@/server/http/response";

async function checkDatabase(databaseConfigured: boolean) {
  if (!databaseConfigured) {
    return { configured: false, reachable: false, error: null as string | null };
  }

  try {
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    return { configured: true, reachable: true, error: null as string | null };
  } catch (error) {
    return {
      configured: true,
      reachable: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function GET() {
  const env = getEnvironment();
  const database = await checkDatabase(Boolean(env.databaseUrl));

  return jsonOk({
    service: "portfolio-api",
    status: database.reachable || !database.configured ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    capabilities: {
      database,
      webhook: Boolean(env.contactWebhookUrl),
      adminApiToken: Boolean(env.adminApiToken),
      internalApiToken: Boolean(env.internalApiToken),
      aiProvider: env.aiProvider ?? "stub",
    },
  });
}
