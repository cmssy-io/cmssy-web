import type { PostHog } from "posthog-js";
import { parseConsent } from "@/lib/consent";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim();
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();

let loading: Promise<PostHog | null> | null = null;
let loaded: PostHog | null = null;

/**
 * posthog-js is ~95 kB gzipped and pulls core-js polyfills (~40 kB) with it,
 * yet it may only capture after a "granted" choice. So it is imported on
 * demand - the first time a visitor has consented - instead of shipping to
 * every visitor in the initial bundle (PageSpeed "unused JavaScript").
 *
 * The init options are unchanged from the eager setup: opted out by default
 * and `before_send` re-checks the cookie, so a load that races a withdrawal
 * still sends nothing.
 */
export function loadPostHog(): Promise<PostHog | null> {
  if (!token || !host) return Promise.resolve(null);
  loading ??= import("posthog-js").then(
    ({ default: posthog }) =>
      new Promise<PostHog>((resolve) => {
        posthog.init(token, {
          api_host: host,
          defaults: "2026-05-30",
          person_profiles: "always",
          disable_session_recording: true,
          disable_surveys: true,
          advanced_disable_flags: true,
          opt_out_capturing_by_default: true,
          opt_out_persistence_by_default: true,
          before_send: (event) =>
            parseConsent(document.cookie) === "granted" ? event : null,
          // Exposed only once the SDK reports itself loaded: opt-in and
          // get_distinct_id() need that state, not just init() having returned.
          loaded: () => {
            loaded = posthog;
            resolve(posthog);
          },
        });
      }),
  );
  return loading;
}

/** The instance once loaded, else null - for synchronous callers. */
export function loadedPostHog(): PostHog | null {
  return loaded;
}
