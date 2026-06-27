import { listArticles, parseArticleLocale } from "@/server/articles/service";
import { jsonError, jsonOk } from "@/server/http/response";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeResult = parseArticleLocale(searchParams.get("lang"));
  const limitParam = searchParams.get("limit");

  if (!localeResult.ok) {
    return jsonError("Unsupported locale.", {
      status: 400,
      details: [localeResult.error],
    });
  }

  const parsedLimit = limitParam ? Number(limitParam) : null;

  if (parsedLimit !== null && (!Number.isInteger(parsedLimit) || parsedLimit < 1)) {
    return jsonError("Invalid limit.", {
      status: 400,
      details: [
        {
          field: "limit",
          message: "Limit must be a positive integer.",
        },
      ],
    });
  }

  const items = listArticles(localeResult.locale, parsedLimit);
  const total = listArticles(localeResult.locale).length;

  return jsonOk({
    locale: localeResult.locale,
    total,
    items,
  });
}
