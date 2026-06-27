import { createHash, randomBytes } from "node:crypto";

export const adminSessionCookieName = "portfolio_admin_session";
export const adminSessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export function createRawSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionExpiryDate() {
  return new Date(Date.now() + adminSessionMaxAgeSeconds * 1000);
}

export function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(";");

  for (const part of parts) {
    const [cookieName, ...valueParts] = part.trim().split("=");

    if (cookieName === name) {
      return valueParts.join("=") || null;
    }
  }

  return null;
}
