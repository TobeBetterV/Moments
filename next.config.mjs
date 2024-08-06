import { get } from "@vercel/edge-config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
  reactStrictMode: true,
  redirects: async () => {
    const redirects = [
      {
        source: "/",
        destination: "/notes",
        permanent: true,
      },
    ];
    try {
      return [...redirects, ...(await get("redirects"))];
    } catch {
      return [];
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
