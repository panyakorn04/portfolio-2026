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
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function deliverContactSubmission(submission: ContactSubmission) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.CONTACT_WEBHOOK_SECRET?.trim();

  if (!webhookUrl) {
    return {
      mode: "database" as const,
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(webhookSecret ? { authorization: `Bearer ${webhookSecret}` } : {}),
    },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error(`Webhook delivery failed with status ${response.status}.`);
  }

  return {
    mode: "database+webhook" as const,
  };
}
