import type { NextConfig } from "next";

const apiBaseUrl = (
    process.env.FRONTEND_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "https://api.panyakorn.com"
).replace(/\/+$/, "");

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
        const securityHeaders = [
            { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
            { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
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
                        value: "no-store, max-age=0",
                    },
                ],
            },
        ];
    },
    turbopack: {
        root: __dirname,
    },
};

export default nextConfig;
