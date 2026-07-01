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
        return [
            {
                source: "/assets/profile:variant(.*).jpg",
                headers: [
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
