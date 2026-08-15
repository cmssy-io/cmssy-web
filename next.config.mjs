/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  /* The delivery API allows 100 requests a minute per IP and a cold build of
     91 pages wants more than that, so the fetch guard in lib/cmssy-fetch-guard
     paces them. Pacing means waiting, and a page that waits its turn can pass
     the default 60s: eight of them did, and each timeout is re-rendered from
     scratch, which spends the budget the wait was protecting. Measured cold,
     the whole build takes under three minutes - so the per-page ceiling only
     has to be generous enough not to fire. */
  staticPageGenerationTimeout: 240,
};

export default nextConfig;
