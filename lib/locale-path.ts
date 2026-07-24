export interface SiteLocales {
  defaultLocale: string;
  locales: string[];
}

export function splitLocaleFromPath(
  path: string[] | undefined,
  locales: SiteLocales,
): { locale: string; path: string[] } {
  const segments = path ?? [];
  const first = segments[0];
  if (
    first &&
    first !== locales.defaultLocale &&
    locales.locales.includes(first)
  ) {
    return { locale: first, path: segments.slice(1) };
  }
  return { locale: locales.defaultLocale, path: segments };
}

export function localizedPath(
  slug: string,
  locale: string,
  defaultLocale: string,
): string {
  const normalized =
    slug === "/" || slug === ""
      ? "/"
      : slug.startsWith("/")
        ? slug
        : `/${slug}`;
  const base = normalized === "/" ? "" : normalized;
  return locale === defaultLocale ? base || "/" : `/${locale}${base}`;
}

export function pickLocalized(
  value: Record<string, unknown> | string | null | undefined,
  locale: string,
  defaultLocale: string,
): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  const candidate =
    value[locale] ?? value[defaultLocale] ?? Object.values(value)[0];
  return typeof candidate === "string" ? candidate : "";
}
