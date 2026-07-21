import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale } from "./lib/portfolio";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const nonce = crypto.randomUUID();
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""} https://us-assets.i.posthog.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://api.panyakorn.com",
    "font-src 'self' data:",
    "connect-src 'self' https://api.panyakorn.com https://us.i.posthog.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: ["/((?!_next/|favicon|icon\\.svg|robots\\.txt|sitemap\\.xml|assets/).*)"],
};
