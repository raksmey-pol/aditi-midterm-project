import type { NextConfig } from "next";

// Parse backend URL from env so remotePatterns stays in sync with NEXT_PUBLIC_API_URL
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "placehold.net",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Proxy /uploads/** to the backend so next/image never hits a private IP
        source: "/uploads/:path*",
        destination: `${apiUrl.origin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
