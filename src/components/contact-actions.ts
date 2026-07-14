"use server";

import type { Locale } from "../lib/portfolio";
import type {
  ContactFieldErrors,
  ContactFieldName,
  ContactFormState,
} from "./contact-form-state";

type ApiErrorResponse = {
  ok: false;
  error: {
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
};

type ApiSuccessResponse = {
  ok: true;
  data: {
    message: string;
    deliveryMode: string;
    submittedAt: string;
  };
};

const CONTACT_FIELDS: ContactFieldName[] = [
  "name",
  "email",
  "company",
  "subject",
  "message",
];

function isContactField(value: string): value is ContactFieldName {
  return (CONTACT_FIELDS as string[]).includes(value);
}

function getApiBaseUrl() {
  return (
    process.env.FRONTEND_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://api.panyakorn.com"
  ).replace(/\/+$/, "");
}

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    locale: String(formData.get("locale") ?? "en") as Locale,
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return {
        status: "error",
        message: null,
        fieldErrors: {},
      };
    }

    const data = (await response.json()) as ApiSuccessResponse | ApiErrorResponse;

    if (!response.ok || !data.ok) {
      const errorData = data as ApiErrorResponse;
      const fieldErrors = (errorData.error.details ?? []).reduce<ContactFieldErrors>(
        (result, detail) => {
          if (isContactField(detail.field)) {
            result[detail.field] = detail.message;
          }
          return result;
        },
        {},
      );

      return {
        status: "error",
        message: errorData.error.message ?? null,
        fieldErrors,
      };
    }
  } catch {
    return {
      status: "error",
      message: null,
      fieldErrors: {},
    };
  }

  return {
    status: "success",
    message: null,
    fieldErrors: {},
  };
}
