import { findArticle, parseArticleLocale } from "@/server/articles/service";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(
  request: Request,
  context: RouteContext<"/api/articles/[slug]">,
) {
  const { searchParams } = new URL(request.url);
  const localeResult = parseArticleLocale(searchParams.get("lang"));

  if (!localeResult.ok) {
    return jsonError("Unsupported locale.", {
      status: 400,
      details: [localeResult.error],
    });
  }

  const { slug } = await context.params;
  const article = findArticle(localeResult.locale, slug);

  if (!article) {
    return jsonError("Article not found.", {
      status: 404,
      details: [
        {
          field: "slug",
          message: "No article matched the requested slug.",
        },
      ],
    });
  }

  return jsonOk({
    locale: localeResult.locale,
    item: article,
  });
}
