import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    const backend = process.env.API_BASE_URL || process.env.VITE_API_BASE_URL;
    return backend ? [{
      source: "/api/backend/:path*",
      destination: backend.replace(/\/+$/, "") + "/:path*",
    }] : [];
  },
};

export default nextConfig;
