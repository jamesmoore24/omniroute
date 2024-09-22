import "dotenv/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["i.imgur.com"], // Add this line
  },
};

export default nextConfig;
