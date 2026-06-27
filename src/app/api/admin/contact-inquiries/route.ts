import { requireAdminAccess } from "@/server/auth/access";
import {
  contactInquiryStatuses,
  listContactInquiries,
} from "@/server/db/contact-inquiries";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: Request) {
  try {
    await requireAdminAccess(request);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const pageParam = searchParams.get("page");
  const statusParam = searchParams.get("status");
  const query = searchParams.get("query")?.trim() ?? "";
  const limit = limitParam ? Number(limitParam) : 20;
  const page = pageParam ? Number(pageParam) : 1;

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return jsonError("Limit must be an integer between 1 and 100.", {
      status: 400,
      details: [
        {
          field: "limit",
          message: "Use a value between 1 and 100.",
        },
      ],
    });
  }

  if (!Number.isInteger(page) || page < 1) {
    return jsonError("Page must be an integer greater than 0.", {
      status: 400,
      details: [
        {
          field: "page",
          message: "Use a value starting at 1.",
        },
      ],
    });
  }

  if (
    statusParam &&
    statusParam !== "all" &&
    !contactInquiryStatuses.includes(
      statusParam as (typeof contactInquiryStatuses)[number],
    )
  ) {
    return jsonError("Status filter is invalid.", {
      status: 400,
      details: [
        {
          field: "status",
          message: `Use one of: all, ${contactInquiryStatuses.join(", ")}.`,
        },
      ],
    });
  }

  const result = await listContactInquiries({
    limit,
    page,
    status:
      (statusParam as "all" | (typeof contactInquiryStatuses)[number] | null) ?? "all",
    query: query || undefined,
  });

  return jsonOk(result);
}
