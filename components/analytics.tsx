"use client";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { useConsent } from "@/components/consent";
import { PostHogAnalytics } from "@/components/posthog-analytics";

export function Analytics({
  gaId,
  gtmId,
  appUrl,
}: {
  gaId?: string;
  gtmId?: string;
  appUrl: string;
}) {
  const granted = useConsent() === "granted";
  return (
    <>
      <PostHogAnalytics appUrl={appUrl} />
      {granted && gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {granted && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  );
}
