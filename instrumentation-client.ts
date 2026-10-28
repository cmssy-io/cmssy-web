import posthog from "posthog-js";
import { parseConsent } from "@/lib/consent";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim();
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();

if (token && host) {
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
  });
}
