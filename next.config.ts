import { createRequire } from "module";
import type { NextConfig } from "next";
import { getApiBaseUrl } from "./src/lib/api-base-url";

const apiBaseUrl = getApiBaseUrl();

const withBundleAnalyzer =
    process.env.ANALYZE === "true"
        ? createRequire(import.meta.url)("@next/bundle-analyzer")({
              enabled: true,
          })
        : (config: NextConfig) => config;

const nextConfig: NextConfig = {
    output: "standalone",
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${apiBaseUrl}/api/:path*`,
            },
        ];
    },
    images: {
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    async headers() {
        // Next.js dev server injects an inline bootstrap script (`self.__next_r=...`)
        // used by its dev-only debug channel. It only exists when `__NEXT_DEV_SERVER`
        // is set (see next/dist/server/app-render/app-render.js), so relaxing
        // script-src for inline execution is safe here and never applies to
        // production builds.
        const isDev = process.env.NODE_ENV !== "production";
        const scriptSrc = [
            "'self'",
            "'unsafe-eval'",
            "https://us-assets.i.posthog.com",
            ...(isDev ? ["'unsafe-inline'"] : []),
        ].join(" ");
        const securityHeaders = [
            {
                key: "Content-Security-Policy",
                value: [
                    "default-src 'self'",
                    `script-src ${scriptSrc}`,
                    "style-src 'self' 'unsafe-inline'",
                    "img-src 'self' data: blob: https://api.panyakorn.com",
                    "font-src 'self' data:",
                    "connect-src 'self' https://api.panyakorn.com https://us.i.posthog.com",
                    "frame-ancestors 'none'",
                    "object-src 'none'",
                    "base-uri 'self'",
                    "form-action 'self'",
                ].join("; "),
            },
            { key: "X-Content-Type-Options", value: "nosniff" },
            {
                key: "Referrer-Policy",
                value: "strict-origin-when-cross-origin",
            },
            {
                key: "Permissions-Policy",
                value: "camera=(), microphone=(), geolocation=()",
            },
            {
                key: "Strict-Transport-Security",
                value: "max-age=31536000; includeSubDomains",
            },
        ];

        return [
            {
                source: "/:path*",
                headers: securityHeaders,
            },
            {
                source: "/assets/profile:variant(.*).jpg",
                headers: [
                    ...securityHeaders,
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
    turbopack: {
        root: __dirname,
    },
};

export default withBundleAnalyzer(nextConfig);
