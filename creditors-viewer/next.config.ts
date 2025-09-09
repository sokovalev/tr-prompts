import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    turbo: {
      // Disable turbopack for production builds to avoid CSS processing issues
      rules: {
        "*.css": {
          loaders: [],
          as: "*.css",
        },
      },
    },
  },
};

export default nextConfig;
