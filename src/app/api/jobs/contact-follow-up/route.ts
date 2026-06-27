import { requireInternalAccess } from "@/server/auth/access";
import { getContactInquiryById } from "@/server/db/contact-inquiries";
import { jsonError, jsonOk } from "@/server/http/response";
import { queueContactFollowUp } from "@/server/jobs/contact-follow-up";

export async function POST(request: Request) {
  try {
    requireInternalAccess(request);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.", {
      status: 400,
    });
  }

  const inquiryId =
    payload && typeof payload === "object" && "inquiryId" in payload
      ? payload.inquiryId
      : null;

  if (typeof inquiryId !== "string" || inquiryId.trim().length === 0) {
    return jsonError("inquiryId is required.", {
      status: 400,
      details: [
        {
          field: "inquiryId",
          message: "Provide a valid inquiry id.",
        },
      ],
    });
  }

  const inquiry = await getContactInquiryById(inquiryId);

  if (!inquiry) {
    return jsonError("Inquiry not found.", {
      status: 404,
    });
  }

  const queued = await queueContactFollowUp(inquiry);

  return jsonOk(queued, {
    status: 202,
  });
}
