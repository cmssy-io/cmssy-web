"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { useConsent } from "@/components/consent";
import { handoffHref } from "@/lib/app-handoff";

export function PostHogAnalytics({ appUrl }: { appUrl: string }) {
  const consent = useConsent();

  useEffect(() => {
    if (!posthog.__loaded || consent === "pending") return;
    const optedOut = posthog.has_opted_out_capturing();
    if (consent === "granted" && optedOut) {
      posthog.opt_in_capturing();
    } else if (consent !== "granted" && !optedOut) {
      posthog.opt_out_capturing();
    }
  }, [consent]);

  useEffect(() => {
    function onNavigate(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const distinctId =
        consent === "granted" && posthog.__loaded
          ? posthog.get_distinct_id()
          : null;
      const next = handoffHref(
        anchor.getAttribute("href") ?? "",
        location.href,
        appUrl,
        distinctId,
      );
      if (next) anchor.href = next;
    }
    document.addEventListener("click", onNavigate, true);
    document.addEventListener("auxclick", onNavigate, true);
    return () => {
      document.removeEventListener("click", onNavigate, true);
      document.removeEventListener("auxclick", onNavigate, true);
    };
  }, [appUrl, consent]);

  return null;
}
