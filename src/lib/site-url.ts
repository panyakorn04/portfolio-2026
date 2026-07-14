const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string) {
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  return withScheme.endsWith("/") ? withScheme.slice(0, -1) : withScheme;
}

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    return LOCAL_SITE_URL;
  }

  return normalizeSiteUrl(value);
}

export function getMetadataBase() {
  return new URL(getSiteUrl());
}

export function getLocalizedSitePath(lang: string, pathname = "") {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return `/${lang}${pathname ? normalizedPathname : ""}`;
}

export function getAbsoluteSiteUrl(pathname: string) {
  return `${getSiteUrl()}${pathname}`;
}
