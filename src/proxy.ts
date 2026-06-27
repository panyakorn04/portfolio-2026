import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale, hasLocale, type Locale, locales } from "./app/_data/portfolio";

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");

  if (!header) {
    return defaultLocale;
  }

  const languages = header.split(",").flatMap((value) => {
    const normalized = value.split(";")[0]?.trim().toLowerCase();

    return normalized ? [normalized] : [];
  });

  for (const language of languages) {
    const baseLanguage = language.split("-")[0];

    if (baseLanguage && hasLocale(baseLanguage)) {
      return baseLanguage;
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|icon.svg|assets|.*\\..*).*)"],
};
