/**
 * Shared API base URL resolver.
 *
 * Order of preference:
 * 1. BUILD_API_BASE_URL  — server-side only, used during Next.js build (SSR/SSG data fetching)
 * 2. FRONTEND_API_BASE_URL — server-side rewrite target (Docker network, e.g. http://backend:8888)
 * 3. NEXT_PUBLIC_API_URL   — public client-side env var (browser-safe, same-origin by default)
 * 4. Fallback default       — https://api.panyakorn.com
 */
export function getApiBaseUrl(): string {
  return (
    process.env.BUILD_API_BASE_URL?.trim() ||
    process.env.FRONTEND_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://api.panyakorn.com"
  ).replace(/\/+$/, "");
}
