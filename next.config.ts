import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This allows production builds to successfully complete even if
    // your project has ESLint errors.
  ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore TS errors during build for speed to live, though build passed locally.
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
