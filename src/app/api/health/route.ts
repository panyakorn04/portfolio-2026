import { getEnvironment } from "@/server/env";
import { jsonOk } from "@/server/http/response";

export function GET() {
  const env = getEnvironment();

  return jsonOk({
    service: "portfolio-api",
    status: "ok",
    timestamp: new Date().toISOString(),
    capabilities: {
      database: Boolean(env.databaseUrl),
      webhook: Boolean(env.contactWebhookUrl),
      adminApiToken: Boolean(env.adminApiToken),
      internalApiToken: Boolean(env.internalApiToken),
      aiProvider: env.aiProvider ?? "stub",
    },
  });
}
