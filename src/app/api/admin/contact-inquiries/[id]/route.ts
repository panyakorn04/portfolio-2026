import { Prisma } from "@prisma/client";

import { assertStaffRole, requireAdminAccess } from "@/server/auth/access";
import {
  contactInquiryStatuses,
  getContactInquiryDetailById,
  updateContactInquiry,
} from "@/server/db/contact-inquiries";
import { jsonError, jsonOk } from "@/server/http/response";

type PatchPayload = {
  status?: string;
  internalNote?: string;
};

function isContactInquiryStatus(
  value: string,
): value is (typeof contactInquiryStatuses)[number] {
  return contactInquiryStatuses.includes(
    value as (typeof contactInquiryStatuses)[number],
  );
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/contact-inquiries/[id]">,
) {
  let access: Awaited<ReturnType<typeof requireAdminAccess>>;

  try {
    access = await requireAdminAccess(request);
    assertStaffRole(access, ["admin", "editor"]);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

  const { id } = await context.params;
  const payload = (await request.json().catch(() => null)) as PatchPayload | null;

  if (!payload) {
    return jsonError("Request body must be valid JSON.", {
      status: 400,
    });
  }

  const status = payload.status?.trim();
  const internalNote = payload.internalNote?.trim() ?? "";

  if (!status || !isContactInquiryStatus(status)) {
    return jsonError("Status is invalid.", {
      status: 400,
      details: [
        {
          field: "status",
          message: `Use one of: ${contactInquiryStatuses.join(", ")}.`,
        },
      ],
    });
  }

  if (internalNote.length > 2000) {
    return jsonError("Internal note is too long.", {
      status: 400,
      details: [
        {
          field: "internalNote",
          message: "Keep the note under 2000 characters.",
        },
      ],
    });
  }

  try {
    const item = await updateContactInquiry(id, {
      status,
      internalNote: internalNote || null,
      actorType: access.via === "session" ? "admin_session" : "admin_token",
      actorLabel:
        access.via === "session"
          ? (access.user?.email ?? "admin_session")
          : "admin_token",
    });

    return jsonOk(item);
  } catch (error) {
    const prismaCode =
      error instanceof Prisma.PrismaClientKnownRequestError
        ? error.code
        : (error as { code?: string })?.code;

    if (prismaCode === "P2025") {
      return jsonError("Contact inquiry was not found.", {
        status: 404,
      });
    }

    throw error;
  }
}

export async function GET(
  request: Request,
  context: RouteContext<"/api/admin/contact-inquiries/[id]">,
) {
  try {
    await requireAdminAccess(request);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

  const { id } = await context.params;
  const item = await getContactInquiryDetailById(id);

  if (!item) {
    return jsonError("Contact inquiry was not found.", {
      status: 404,
    });
  }

  return jsonOk(item);
}
