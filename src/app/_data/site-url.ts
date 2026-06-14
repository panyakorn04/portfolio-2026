const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
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
