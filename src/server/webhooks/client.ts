import { getEnvironment } from "../env";

export async function sendWebhookJson(
  payload: unknown,
  options?: {
    url?: string | null;
    secret?: string | null;
  },
) {
  const env = getEnvironment();
  const url = options?.url ?? env.contactWebhookUrl;
  const secret = options?.secret ?? env.contactWebhookSecret;

  if (!url) {
    return {
      delivered: false as const,
      reason: "missing-url" as const,
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook delivery failed with status ${response.status}.`);
  }

  return {
    delivered: true as const,
  };
}
