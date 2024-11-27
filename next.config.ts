import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'firebasestorage.googleapis.com'
      }
    ]

  },
  eslint: {
    ignoreDuringBuilds: true, // Ignora os erros de ESLint durante a build
  },
};

export default nextConfig;
