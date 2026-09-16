"use client";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { useConsent } from "@/components/consent";

export function Analytics({ gaId, gtmId }: { gaId?: string; gtmId?: string }) {
  if (useConsent() !== "granted") return null;
  return (
    <>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  );
}
