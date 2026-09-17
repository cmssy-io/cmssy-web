export const HANDOFF_DISTINCT_ID_PARAM = "ph_distinct_id";

export const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function bareHost(hostname: string): string {
  return hostname.replace(/^www\./, "");
}

export function handoffHref(
  href: string,
  pageUrl: string,
  appUrl: string,
  distinctId: string | null,
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
  if (target.protocol !== app.protocol) return null;
  if (bareHost(target.hostname) !== bareHost(app.hostname)) return null;

  for (const key of UTM_PARAMS) {
    const value = page.searchParams.get(key);
    if (value && !target.searchParams.has(key)) {
      target.searchParams.set(key, value);
    }
  }
  if (distinctId)
    target.searchParams.set(HANDOFF_DISTINCT_ID_PARAM, distinctId);
  return target.toString();
}
