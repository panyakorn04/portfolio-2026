import { Prisma } from "@prisma/client";
import { validateArticlePayload } from "@/server/articles/service";
import { assertStaffRole, requireAdminAccess } from "@/server/auth/access";
import {
  deleteArticle,
  getArticleById,
  isSlugTaken,
  updateArticle,
} from "@/server/db/articles";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(
  request: Request,
  context: RouteContext<"/api/admin/articles/[id]">,
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
  const article = await getArticleById(id);

  if (!article) {
    return jsonError("Article was not found.", {
      status: 404,
    });
  }

  return jsonOk(article);
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/articles/[id]">,
) {
  try {
    const access = await requireAdminAccess(request);
    assertStaffRole(access, ["admin", "editor"]);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

  const { id } = await context.params;
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return jsonError("Request body must be valid JSON.", {
      status: 400,
    });
  }

  const validation = validateArticlePayload(payload);

  if (!validation.ok || !validation.input) {
    return jsonError("Article payload is invalid.", {
      status: 400,
      details: validation.details,
    });
  }

  if (await isSlugTaken(validation.input.slug, id)) {
    return jsonError("Slug is already in use.", {
      status: 409,
      details: [
        {
          field: "slug",
          message: "Choose a different slug.",
        },
      ],
    });
  }

  try {
    const article = await updateArticle(id, validation.input);

    return jsonOk(article);
  } catch (error) {
    const prismaCode =
      error instanceof Prisma.PrismaClientKnownRequestError
        ? error.code
        : (error as { code?: string })?.code;

    if (prismaCode === "P2025") {
      return jsonError("Article was not found.", {
        status: 404,
      });
    }

    throw error;
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/articles/[id]">,
) {
  try {
    const access = await requireAdminAccess(request);
    assertStaffRole(access, ["admin", "editor"]);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

  const { id } = await context.params;

  try {
    await deleteArticle(id);

    return jsonOk({ id });
  } catch (error) {
    const prismaCode =
      error instanceof Prisma.PrismaClientKnownRequestError
        ? error.code
        : (error as { code?: string })?.code;

    if (prismaCode === "P2025") {
      return jsonError("Article was not found.", {
        status: 404,
      });
    }

    throw error;
  }
}
