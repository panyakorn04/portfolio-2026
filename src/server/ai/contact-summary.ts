import type { ContactInquiryRecord } from "../db/contact-inquiries";
import { getAiProviderConfig } from "./provider";

export function buildContactSummaryPrompt(inquiry: ContactInquiryRecord) {
  return [
    `Summarize this contact inquiry for admin follow-up.`,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company: ${inquiry.company ?? "-"}`,
    `Subject: ${inquiry.subject}`,
    `Locale: ${inquiry.locale}`,
    `Message: ${inquiry.message}`,
  ].join("\n");
}

export async function generateContactSummary(inquiry: ContactInquiryRecord) {
  const config = getAiProviderConfig();
  const prompt = buildContactSummaryPrompt(inquiry);

  if (!config.hasApiKey) {
    return {
      provider: config.provider,
      mode: "stub" as const,
      summary: `Follow up with ${inquiry.name} about "${inquiry.subject}". They mentioned: ${inquiry.message}`,
      prompt,
    };
  }

  return {
    provider: config.provider,
    mode: "stub" as const,
    summary: `AI provider wiring is reserved for ${config.provider}. Prompt prepared successfully for inquiry ${inquiry.id}.`,
    prompt,
  };
}
