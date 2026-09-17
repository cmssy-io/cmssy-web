import { describe, expect, it } from "vitest";
import {
  analyticsCookieExpiries,
  consentModeInitScript,
  parseConsent,
  serializeConsent,
} from "./consent";

function runInitScript(cookie: string, existing?: unknown[]) {
  const window: { dataLayer?: unknown[]; gtag?: unknown } = {};
  if (existing) window.dataLayer = existing;
  new Function("window", "document", consentModeInitScript())(window, {
    cookie,
  });
  return (window.dataLayer ?? []).map((entry) => ({
    kind: Object.prototype.toString.call(entry),
    args: Array.from(entry as ArrayLike<unknown>),
  }));
}

describe("parseConsent", () => {
  it("reads the stored choice among other cookies", () => {
    expect(parseConsent("_ga=GA1.1.1; cmssy_consent=granted; theme=dark")).toBe(
      "granted",
    );
    expect(parseConsent("cmssy_consent=denied")).toBe("denied");
  });

  it("treats a missing, foreign or garbled value as no choice yet", () => {
    expect(parseConsent("")).toBe("unset");
    expect(parseConsent("x_cmssy_consent=granted")).toBe("unset");
    expect(parseConsent("cmssy_consent=yes")).toBe("unset");
  });
});

describe("serializeConsent", () => {
  it("writes a site-wide, six-month, lax cookie", () => {
    expect(serializeConsent("granted", true)).toBe(
      "cmssy_consent=granted; Path=/; Max-Age=15552000; SameSite=Lax; Secure",
    );
    expect(serializeConsent("denied", false)).toBe(
      "cmssy_consent=denied; Path=/; Max-Age=15552000; SameSite=Lax",
    );
  });
});

describe("analyticsCookieExpiries", () => {
  it("expires every GA cookie on the host and each parent domain", () => {
    expect(
      analyticsCookieExpiries(
        "_ga=GA1.1.1; _ga_ABC123=GS1; cmssy_consent=denied; _gid=x; _gallery=keep; _gatx; ph_phc_x_posthog=%7B%7D; __ph_opt_in_out_phc_x=0; graph=keep",
        "www.cmssy.com",
      ),
    ).toEqual([
      "_ga=; Path=/; Max-Age=0",
      "_ga=; Path=/; Domain=www.cmssy.com; Max-Age=0",
      "_ga=; Path=/; Domain=cmssy.com; Max-Age=0",
      "_ga_ABC123=; Path=/; Max-Age=0",
      "_ga_ABC123=; Path=/; Domain=www.cmssy.com; Max-Age=0",
      "_ga_ABC123=; Path=/; Domain=cmssy.com; Max-Age=0",
      "_gid=; Path=/; Max-Age=0",
      "_gid=; Path=/; Domain=www.cmssy.com; Max-Age=0",
      "_gid=; Path=/; Domain=cmssy.com; Max-Age=0",
      "ph_phc_x_posthog=; Path=/; Max-Age=0",
      "ph_phc_x_posthog=; Path=/; Domain=www.cmssy.com; Max-Age=0",
      "ph_phc_x_posthog=; Path=/; Domain=cmssy.com; Max-Age=0",
    ]);
  });

  it("sets no Domain attribute on localhost or an IP", () => {
    expect(analyticsCookieExpiries("_ga=1", "localhost")).toEqual([
      "_ga=; Path=/; Max-Age=0",
    ]);
    expect(analyticsCookieExpiries("_ga=1", "127.0.0.1")).toEqual([
      "_ga=; Path=/; Max-Age=0",
    ]);
  });
});

describe("consentModeInitScript", () => {
  const defaults = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  };

  it("denies everything by default, then grants analytics only for a stored yes", () => {
    const pushed = runInitScript("theme=dark; cmssy_consent=granted");
    expect(
      pushed.map((entry) => entry.args),
      "Consent Mode reads the default before any tag; granting analytics must be an update after it, never the default.",
    ).toEqual([
      ["consent", "default", defaults],
      ["consent", "update", { analytics_storage: "granted" }],
    ]);
  });

  it("keeps analytics denied without a stored yes", () => {
    for (const cookie of ["", "cmssy_consent=denied", "cmssy_consent=grantedx"]) {
      expect(runInitScript(cookie)[1]?.args, `cookie: "${cookie}"`).toEqual([
        "consent",
        "update",
        { analytics_storage: "denied" },
      ]);
    }
  });

  it("pushes arguments objects onto an existing dataLayer", () => {
    const pushed = runInitScript("", ["earlier"]);
    expect(
      pushed.map((entry) => entry.kind),
      "gtag.js ignores commands pushed as plain arrays, so the consent calls must be arguments objects appended after what was already queued.",
    ).toEqual(["[object String]", "[object Arguments]", "[object Arguments]"]);
  });
});
