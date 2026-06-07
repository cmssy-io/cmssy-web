// Build the href for a language, mirroring the proxy's `/<lang>/*` routing:
// the default language uses clean URLs, every other language gets a `/<lang>`
// prefix. Shared by both the flag-based and minimal language switchers so the
// routing rule stays in one place.
export function buildLanguageUrl(
  lang: string,
  defaultLanguage: string,
  enabledLanguages: string[],
  currentPath: string,
): string {
  // Strip an existing language prefix.
  const match = currentPath.match(/^\/([a-z]{2})(?:\/|$)/);
  let basePath = currentPath;
  if (match && enabledLanguages.includes(match[1]!)) {
    basePath = currentPath.slice(match[1]!.length + 1) || "/";
  }
  // Default language = clean URL (no prefix); others get the `/<lang>` prefix.
  if (lang === defaultLanguage) return basePath;
  return `/${lang}${basePath === "/" ? "" : basePath}`;
}
