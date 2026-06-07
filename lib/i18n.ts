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
  // Normalize an empty path (e.g. before a client switcher reads the real
  // pathname) to "/" so we never emit href="".
  const path = currentPath || "/";
  // Strip an existing language prefix.
  const match = path.match(/^\/([a-z]{2})(?:\/|$)/);
  let basePath = path;
  if (match && enabledLanguages.includes(match[1]!)) {
    basePath = path.slice(match[1]!.length + 1) || "/";
  }
  // Default language = clean URL (no prefix); others get the `/<lang>` prefix.
  if (lang === defaultLanguage) return basePath;
  return `/${lang}${basePath === "/" ? "" : basePath}`;
}
