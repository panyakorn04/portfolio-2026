import {
  hasDatabaseUrl,
  persistAndDeliverContactSubmission,
  validateContactSubmission,
} from "@/server/contact/service";
import { jsonError, jsonOk } from "@/server/http/response";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.", {
      status: 400,
    });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return jsonError("Request body must be a JSON object.", {
      status: 400,
    });
  }

  const { details, submission } = validateContactSubmission(payload);

  if (details.length > 0) {
    return jsonError("Contact submission validation failed.", {
      status: 422,
      details,
    });
  }

  if (!hasDatabaseUrl()) {
    return jsonError("Contact service is not configured yet.", {
      status: 503,
      details: [
        {
          field: "DATABASE_URL",
          message: "Add a PostgreSQL connection string before using the contact API.",
        },
      ],
    });
  }

  try {
    const result = await persistAndDeliverContactSubmission(submission);

    return jsonOk(
      {
        message: "Contact submission accepted.",
        inquiryId: result.inquiryId,
        deliveryMode: result.deliveryMode,
        submittedAt: result.submittedAt,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("[contact] persistence failed", error);

    return jsonError("Unable to save contact submission right now.", {
      status: 502,
    });
  }
}
