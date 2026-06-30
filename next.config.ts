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
        unoptimized: true,
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
