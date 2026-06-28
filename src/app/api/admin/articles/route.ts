import { validateArticlePayload } from "@/server/articles/service";
import { assertStaffRole, requireAdminAccess } from "@/server/auth/access";
import {
  articleStatuses,
  createArticle,
  isSlugTaken,
  listArticles,
} from "@/server/db/articles";
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
    !articleStatuses.includes(statusParam as (typeof articleStatuses)[number])
  ) {
    return jsonError("Status filter is invalid.", {
      status: 400,
      details: [
        {
          field: "status",
          message: `Use one of: all, ${articleStatuses.join(", ")}.`,
        },
      ],
    });
  }

  const result = await listArticles({
    limit,
    page,
    status: (statusParam as "all" | (typeof articleStatuses)[number] | null) ?? "all",
    query: query || undefined,
  });

  return jsonOk(result);
}

export async function POST(request: Request) {
  try {
    const access = await requireAdminAccess(request);
    assertStaffRole(access, ["admin", "editor"]);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

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

  if (await isSlugTaken(validation.input.slug)) {
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

  const article = await createArticle(validation.input);

  return jsonOk(article, { status: 201 });
}
