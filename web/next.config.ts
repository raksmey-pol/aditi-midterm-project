import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "cdn-icons-png.flaticon.com",
      "placehold.net",
    ],
  },
};

export default nextConfig;
