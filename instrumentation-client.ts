import { parseConsent } from "@/lib/consent";
import { loadPostHog } from "@/lib/posthog-client";

// A returning visitor who already consented starts loading analytics as early
// as possible (an async chunk, off the critical path); everyone else loads it
// only after choosing "granted" (PostHogAnalytics).
if (parseConsent(document.cookie) === "granted") void loadPostHog();
