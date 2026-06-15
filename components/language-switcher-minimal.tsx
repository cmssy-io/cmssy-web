"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { buildLocaleSwitchHref } from "@cmssy/react";
import { useCmssyLocale } from "@cmssy/react/client";
import { cn } from "../lib/utils";

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
  const pathname = usePathname();
  const ctx = useCmssyLocale();
  const enabled = ctx?.enabled ?? enabledLanguages;
  const defaultLang = ctx?.default ?? defaultLanguage;

  if (enabled.length <= 1) return null;

  const localeCtx = {
    current: currentLanguage,
    default: defaultLang,
    enabled,
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium tracking-wide",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {enabled.map((lang, i) => {
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
                href={buildLocaleSwitchHref(lang, pathname, localeCtx)}
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
