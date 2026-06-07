"use client";

import { Fragment, useEffect, useState } from "react";
import { cn } from "../lib/utils";

// Build the href for a language, mirroring the proxy's `/pl/*` routing:
// the default language uses clean URLs, others get a `/<lang>` prefix.
function buildLanguageUrl(
  lang: string,
  defaultLanguage: string,
  enabledLanguages: string[],
  currentPath: string,
): string {
  const match = currentPath.match(/^\/([a-z]{2})(?:\/|$)/);
  let basePath = currentPath;
  if (match && enabledLanguages.includes(match[1]!)) {
    basePath = currentPath.slice(match[1]!.length + 1) || "/";
  }
  if (lang === defaultLanguage) return basePath;
  return `/${lang}${basePath === "/" ? "" : basePath}`;
}

// Seed the path from the current language so SSR and the first client render
// agree (no hydration mismatch) and hrefs are never empty. The real, full
// pathname is read after mount, refining the hrefs to the exact sub-route.
function useCurrentPathname(initialPath: string): string {
  const [path, setPath] = useState(initialPath);
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  return path;
}

interface LanguageSwitcherMinimalProps {
  enabledLanguages: string[];
  defaultLanguage: string;
  currentLanguage: string;
  className?: string;
}

// Minimal, flag-free language switcher: an inline `EN / PL` toggle. The active
// language is shown at full strength, the others are muted links. No dropdown,
// no flags - it stays out of the way in a clean header.
export function LanguageSwitcherMinimal({
  enabledLanguages,
  defaultLanguage,
  currentLanguage,
  className,
}: LanguageSwitcherMinimalProps) {
  const initialPath =
    currentLanguage === defaultLanguage ? "/" : `/${currentLanguage}`;
  const currentPath = useCurrentPathname(initialPath);

  if (enabledLanguages.length <= 1) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium tracking-wide",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {enabledLanguages.map((lang, i) => {
        const isActive = lang === currentLanguage;
        return (
          <Fragment key={lang}>
            {i > 0 && (
              <span aria-hidden className="text-current opacity-25 select-none">
                /
              </span>
            )}
            {isActive ? (
              <span
                data-no-localize
                aria-current="true"
                className="rounded uppercase opacity-100"
              >
                {lang}
              </span>
            ) : (
              <a
                href={buildLanguageUrl(
                  lang,
                  defaultLanguage,
                  enabledLanguages,
                  currentPath,
                )}
                data-no-localize
                className={cn(
                  "rounded uppercase opacity-45 transition-opacity hover:opacity-80",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-current/30",
                )}
              >
                {lang}
              </a>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
