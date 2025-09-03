import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      new URL("https://cdn.xann.my.id/**"),
      new URL("https://lh3.googleusercontent.com/**"),
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
