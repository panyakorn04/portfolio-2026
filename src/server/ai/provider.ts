import { getEnvironment } from "../env";

export function getAiProviderConfig() {
  const env = getEnvironment();

  return {
    provider: env.aiProvider ?? "stub",
    hasApiKey: Boolean(env.aiApiKey),
  };
}
