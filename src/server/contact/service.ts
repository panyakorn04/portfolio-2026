import {
  createContactInquiry,
  updateContactInquiryDeliveryMode,
} from "../db/contact-inquiries";
import { getEnvironment } from "../env";
import { sendWebhookJson } from "../webhooks/client";

export type ContactSubmissionInput = {
  name?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
  locale?: string;
};

export type ContactSubmission = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  locale: string;
  submittedAt: string;
};

export function validateContactSubmission(input: ContactSubmissionInput) {
  const details: Array<{ field: string; message: string }> = [];

  const name = input.name?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";
  const company = input.company?.trim() ?? "";
  const subject = input.subject?.trim() ?? "";
  const message = input.message?.trim() ?? "";
  const locale = input.locale?.trim().toLowerCase() ?? "en";

  if (name.length < 2) {
    details.push({
      field: "name",
      message: "Name must be at least 2 characters long.",
    });
  }

  if (!email.includes("@") || email.startsWith("@") || email.endsWith("@")) {
    details.push({
      field: "email",
      message: "Email must be a valid email address.",
    });
  }

  if (subject.length < 3) {
    details.push({
      field: "subject",
      message: "Subject must be at least 3 characters long.",
    });
  }

  if (message.length < 20) {
    details.push({
      field: "message",
      message: "Message must be at least 20 characters long.",
    });
  }

  return {
    details,
    submission: {
      name,
      email,
      company,
      subject,
      message,
      locale,
      submittedAt: new Date().toISOString(),
    } satisfies ContactSubmission,
  };
}

export function hasDatabaseUrl() {
  return Boolean(getEnvironment().databaseUrl);
}

export async function persistAndDeliverContactSubmission(submission: ContactSubmission) {
  const inquiry = await createContactInquiry(submission);
  let deliveryMode: "database" | "database+webhook" = "database";

  try {
    const delivery = await sendWebhookJson(submission);

    if (delivery.delivered) {
      deliveryMode = "database+webhook";
    }
  } catch (error) {
    console.error("[contact] webhook delivery failed", error);
  }

  if (deliveryMode !== inquiry.deliveryMode) {
    await updateContactInquiryDeliveryMode(inquiry.id, deliveryMode);
  }

  return {
    inquiryId: inquiry.id,
    deliveryMode,
    submittedAt: submission.submittedAt,
  };
}
