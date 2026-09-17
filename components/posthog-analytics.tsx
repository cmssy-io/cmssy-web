"use client";

import { useEffect } from "react";
import type { PostHog } from "posthog-js";
import { useConsent } from "@/components/consent";
import { handoffHref } from "@/lib/app-handoff";

let loading: Promise<PostHog> | null = null;
let ready: PostHog | null = null;

function importPostHog(): Promise<PostHog> {
  loading ??= import("posthog-js").then(({ default: posthog }) => posthog);
  return loading;
}

function stopCapturing() {
  ready?.opt_out_capturing();
  ready?.set_config({ disable_persistence: true });
}

function startCapturing(posthog: PostHog, token: string, host: string) {
  if (ready) {
    ready.set_config({ disable_persistence: false });
  } else {
    posthog.init(token, {
      api_host: host,
      defaults: "2026-01-30",
      person_profiles: "always",
      disable_session_recording: true,
      disable_surveys: true,
    });
    ready = posthog;
  }
  if (posthog.has_opted_out_capturing()) {
    posthog.opt_in_capturing({ captureEventName: false });
  }
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
    if (consent === "denied") stopCapturing();
    if (consent !== "granted") return;
    let current = true;
    importPostHog().then((posthog) => {
      if (current) startCapturing(posthog, token, host);
    });
    return () => {
      current = false;
    };
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
