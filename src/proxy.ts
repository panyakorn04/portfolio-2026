import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, hasLocale, locales, type Locale } from "./app/_data/portfolio";

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");

  if (!header) {
    return defaultLocale;
  }

  const languages = header
    .split(",")
    .map((value) => value.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

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
  matcher: ["/((?!_next|favicon.ico|icon.svg|assets|.*\\..*).*)"],
};
