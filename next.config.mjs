import { CMSSY_RETRY_MODES } from "@cmssy/core";

const DELIVERY_BUDGET_S = CMSSY_RETRY_MODES.build.maxTotalWaitMs / 1000;
const RENDER_HEADROOM_S = 30;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  staticPageGenerationTimeout: DELIVERY_BUDGET_S + RENDER_HEADROOM_S,
  // Every docs page has a Markdown twin at the same address plus ".md".
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/docs.md", destination: "/docs-md" },
        { source: "/docs/:path(.*)\\.md", destination: "/docs-md/:path" },
      ],
    };
  },
};

export default nextConfig;
