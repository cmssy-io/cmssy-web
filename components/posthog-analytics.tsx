"use client";

import { useEffect } from "react";
import type { PostHog } from "posthog-js";
import { useConsent } from "@/components/consent";
import { handoffHref } from "@/lib/app-handoff";

let loading: Promise<PostHog> | null = null;
let ready: PostHog | null = null;

function loadPostHog(token: string, host: string): Promise<PostHog> {
  loading ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(token, {
      api_host: host,
      defaults: "2026-01-30",
      person_profiles: "always",
      disable_session_recording: true,
      disable_surveys: true,
    });
    ready = posthog;
    return posthog;
  });
  return loading;
}

export function PostHogAnalytics({
  token,
  host,
  appUrl,
}: {
  token?: string;
  host?: string;
  appUrl: string;
}) {
  const consent = useConsent();

  useEffect(() => {
    if (!token || !host) return;
    if (consent === "granted") {
      loadPostHog(token, host).then((posthog) => posthog.opt_in_capturing());
    } else if (consent === "denied") {
      ready?.opt_out_capturing();
    }
  }, [consent, token, host]);

  useEffect(() => {
    function onNavigate(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const distinctId =
        consent === "granted" && ready ? ready.get_distinct_id() : null;
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
