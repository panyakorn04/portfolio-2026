import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale } from "./lib/portfolio";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
}

export const config = {
  matcher: "/",
};
