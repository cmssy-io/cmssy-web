import { CMSSY_RATE_LIMIT_WINDOW_MS } from "@cmssy/core";

const DELIVERY_RETRIES = 4;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  staticPageGenerationTimeout:
    (DELIVERY_RETRIES * CMSSY_RATE_LIMIT_WINDOW_MS) / 1000,
};

export default nextConfig;
