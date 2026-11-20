export const HANDOFF_DISTINCT_ID_PARAM = "ph_distinct_id";

export const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type LandingUtm = Partial<Record<(typeof UTM_PARAMS)[number], string>>;

/**
 * The UTM a visitor landed with. Kept in memory by the caller, never in
 * storage, so it needs no consent and lasts only for client-side navigation.
 */
export function readLandingUtm(pageUrl: string): LandingUtm {
  const utm: LandingUtm = {};
  let page: URL;
  try {
    page = new URL(pageUrl);
  } catch {
    return utm;
  }
  for (const key of UTM_PARAMS) {
    const value = page.searchParams.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

function bareHost(hostname: string): string {
  return hostname.replace(/^www\./, "");
}

export function handoffHref(
  href: string,
  pageUrl: string,
  appUrl: string,
  distinctId: string | null,
  landing: LandingUtm = {},
): string | null {
  let target: URL;
  let page: URL;
  let app: URL;
  try {
    page = new URL(pageUrl);
    target = new URL(href, page);
    app = new URL(appUrl);
  } catch {
    return null;
  }
  if (target.protocol !== app.protocol || target.port !== app.port) {
    return null;
  }
  if (bareHost(target.hostname) !== bareHost(app.hostname)) return null;

  // The current page's UTM wins; the landing UTM covers a visitor who
  // browsed a few pages before signing up.
  for (const key of UTM_PARAMS) {
    const value = page.searchParams.get(key) || landing[key];
    if (value && !target.searchParams.has(key)) {
      target.searchParams.set(key, value);
    }
  }
  if (distinctId) {
    target.searchParams.set(HANDOFF_DISTINCT_ID_PARAM, distinctId);
  } else {
    target.searchParams.delete(HANDOFF_DISTINCT_ID_PARAM);
  }
  return target.toString();
}
