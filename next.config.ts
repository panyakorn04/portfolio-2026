import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
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
