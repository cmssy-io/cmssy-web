export type ConsentState = "granted" | "denied" | "unset";
export type ConsentChoice = Exclude<ConsentState, "unset">;
type ConsentValue = "granted" | "denied";

export const CONSENT_COOKIE = "cmssy_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export const OPEN_CONSENT_HASH = "#cookie-settings";

export const CONSENT_DEFAULTS: Record<string, ConsentValue> = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

function parseCookies(cookieHeader: string): Map<string, string> {
  const cookies = new Map<string, string>();
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    cookies.set(
      part.slice(0, separator).trim(),
      part.slice(separator + 1).trim(),
    );
  }
  return cookies;
}

export function parseConsent(cookieHeader: string): ConsentState {
  const value = parseCookies(cookieHeader).get(CONSENT_COOKIE);
  return value === "granted" || value === "denied" ? value : "unset";
}

export function serializeConsent(
  choice: ConsentChoice,
  secure: boolean,
): string {
  return [
    `${CONSENT_COOKIE}=${choice}`,
    "Path=/",
    `Max-Age=${CONSENT_MAX_AGE}`,
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

export function consentUpdate(
  state: ConsentState,
): Record<string, ConsentValue> {
  return { analytics_storage: state === "granted" ? "granted" : "denied" };
}

export function isAnalyticsCookie(name: string): boolean {
  return /^_ga(_|$)|^_gid$|^_gat(_|$)|^ph_/.test(name);
}

export function cookieDomains(hostname: string): string[] {
  const labels = hostname.split(".");
  if (/^[\d.]+$/.test(hostname)) return [];
  return labels.slice(0, -1).map((_, index) => labels.slice(index).join("."));
}

export function analyticsCookieExpiries(
  cookieHeader: string,
  hostname: string,
): string[] {
  const domains = cookieDomains(hostname);
  return [...parseCookies(cookieHeader).keys()]
    .filter(isAnalyticsCookie)
    .flatMap((name) => [
      `${name}=; Path=/; Max-Age=0`,
      ...domains.map(
        (domain) => `${name}=; Path=/; Domain=${domain}; Max-Age=0`,
      ),
    ]);
}

export function consentModeInitScript(): string {
  const defaults = JSON.stringify(CONSENT_DEFAULTS);
  return `(function(){var w=window;w.dataLayer=w.dataLayer||[];w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};var g=/(?:^|;\\s*)${CONSENT_COOKIE}=granted(?:;|$)/.test(document.cookie);w.gtag('consent','default',${defaults});w.gtag('consent','update',{analytics_storage:g?'granted':'denied'});})();`;
}
