"use client";

import { useEffect } from "react";
import { loadPostHog, loadedPostHog } from "@/lib/posthog-client";
import { useConsent } from "@/components/consent";
import {
  handoffHref,
  readLandingUtm,
  type LandingUtm,
} from "@/lib/app-handoff";

// Module scope, not a ref: the layout that renders this component sits under
// the catch-all [[...path]] segment and can remount on a page change (a ref
// kept in production lost the UTM after one click), while the module lives for
// the whole client-side session. The first mount, on the landing page, wins.
let landing: LandingUtm | null = null;

export function PostHogAnalytics({ appUrl }: { appUrl: string }) {
  const consent = useConsent();
  useEffect(() => {
    landing ??= readLandingUtm(location.href);
  }, []);

  useEffect(() => {
    if (consent === "pending") return;
    // Never load posthog-js for a visitor who has not consented; once loaded,
    // a withdrawal opts it back out.
    const ready =
      consent === "granted"
        ? loadPostHog()
        : Promise.resolve(loadedPostHog());
    let cancelled = false;
    void ready.then((posthog) => {
      if (cancelled || !posthog) return;
      const optedOut = posthog.has_opted_out_capturing();
      if (consent === "granted" && optedOut) {
        posthog.opt_in_capturing();
      } else if (consent !== "granted" && !optedOut) {
        posthog.opt_out_capturing();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [consent]);

  useEffect(() => {
    function onNavigate(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const posthog = loadedPostHog();
      const distinctId =
        consent === "granted" && posthog ? posthog.get_distinct_id() : null;
      const next = handoffHref(
        anchor.getAttribute("href") ?? "",
        location.href,
        appUrl,
        distinctId,
        landing ?? {},
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
