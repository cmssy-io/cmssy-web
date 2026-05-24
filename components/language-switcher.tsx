"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../lib/utils";

// ─── Flag & Language Helpers ────────────────────────────────────────────

const LANG_TO_COUNTRY: Record<string, string> = {
  en: "GB",
  de: "DE",
  fr: "FR",
  es: "ES",
  it: "IT",
  pt: "PT",
  nl: "NL",
  pl: "PL",
  cs: "CZ",
  sk: "SK",
  hu: "HU",
  ro: "RO",
  bg: "BG",
  hr: "HR",
  sl: "SI",
  sr: "RS",
  sq: "AL",
  el: "GR",
  tr: "TR",
  ru: "RU",
  uk: "UA",
  ar: "SA",
  he: "IL",
  fa: "IR",
  hi: "IN",
  bn: "BD",
  th: "TH",
  vi: "VN",
  id: "ID",
  ms: "MY",
  zh: "CN",
  ja: "JP",
  ko: "KR",
  fi: "FI",
  sv: "SE",
  da: "DK",
  nb: "NO",
  nn: "NO",
  no: "NO",
  is: "IS",
  et: "EE",
  lv: "LV",
  lt: "LT",
  ga: "IE",
  mt: "MT",
  af: "ZA",
  sw: "KE",
  am: "ET",
  bs: "BA",
  mk: "MK",
  ka: "GE",
  hy: "AM",
  az: "AZ",
  kk: "KZ",
  uz: "UZ",
};

function getFlagEmoji(langCode: string): string {
  const country = LANG_TO_COUNTRY[langCode];
  if (!country) return "";
  return String.fromCodePoint(
    ...country.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

function getLanguageName(code: string): string {
  try {
    return new Intl.DisplayNames([code], { type: "language" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function buildLanguageUrl(
  lang: string,
  defaultLanguage: string,
  enabledLanguages: string[],
  currentPath: string,
): string {
  // Strip existing language prefix
  const match = currentPath.match(/^\/([a-z]{2})(?:\/|$)/);
  let basePath = currentPath;
  if (match && enabledLanguages.includes(match[1]!)) {
    basePath = currentPath.slice(match[1]!.length + 1) || "/";
  }

  // Default language = clean URL (no prefix)
  if (lang === defaultLanguage) return basePath;

  // Other languages get prefix
  return `/${lang}${basePath === "/" ? "" : basePath}`;
}

// Reads window.location.pathname after mount. Reading it during render
// produced SSR="/" vs client=<pathname> -> different language hrefs ->
// React #418 (hydration mismatch). Effect runs once post-hydration and
// the hrefs resolve on the second client render.
function useCurrentPathname(): string {
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  return path;
}

// ─── Types ──────────────────────────────────────────────────────────────

interface LanguageSwitcherProps {
  /** All enabled language codes */
  enabledLanguages: string[];
  /** Workspace default language (clean URLs) */
  defaultLanguage: string;
  /** Currently active language */
  currentLanguage: string;
  /** Visual variant */
  variant?: "compact" | "full";
  /** Dropdown / item background theme — "light" for white panels, "dark" for dark panels */
  theme?: "light" | "dark";
  /** Additional class names for the root element */
  className?: string;
}

// ─── Compact Variant (Desktop nav) ─────────────────────────────────────
// Trigger: 🇬🇧 EN ▾  →  Dropdown with all languages

function CompactSwitcher({
  enabledLanguages,
  defaultLanguage,
  currentLanguage,
  theme = "light",
  className,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentPath = useCurrentPathname();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const flag = getFlagEmoji(currentLanguage);

  const handleSelect = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5",
          "text-current opacity-70 transition-opacity hover:opacity-100",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-current/30",
          open && "opacity-100",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        {flag && <span className="text-sm leading-none">{flag}</span>}
        <span className="text-xs font-medium uppercase tracking-wide">
          {currentLanguage}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 opacity-50 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-full z-50 mt-1.5",
              "min-w-[160px] overflow-hidden rounded-lg shadow-lg",
              theme === "dark"
                ? "bg-gray-900 text-gray-100 ring-1 ring-white/[0.08]"
                : "bg-white text-gray-900 ring-1 ring-black/[0.08]",
            )}
            role="listbox"
            aria-label="Available languages"
          >
            {enabledLanguages.map((lang) => {
              const langFlag = getFlagEmoji(lang);
              const isActive = lang === currentLanguage;
              return (
                <a
                  key={lang}
                  href={buildLanguageUrl(
                    lang,
                    defaultLanguage,
                    enabledLanguages,
                    currentPath,
                  )}
                  data-no-localize
                  onClick={handleSelect}
                  role="option"
                  aria-selected={isActive}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm",
                    "transition-colors duration-100",
                    theme === "dark"
                      ? "hover:bg-white/10"
                      : "hover:bg-gray-100",
                    isActive && "font-medium",
                  )}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {langFlag && (
                    <span className="text-sm leading-none">{langFlag}</span>
                  )}
                  <span className="capitalize">{getLanguageName(lang)}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wider opacity-40">
                    {lang}
                  </span>
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Full Variant (Mobile menu / Footer) ────────────────────────────────
// Flat inline list of all languages — no dropdown needed

function FullSwitcher({
  enabledLanguages,
  defaultLanguage,
  currentLanguage,
  theme = "light",
  className,
}: LanguageSwitcherProps) {
  const currentPath = useCurrentPathname();
  return (
    <div
      className={cn("flex flex-wrap items-center gap-1", className)}
      role="list"
      aria-label="Available languages"
    >
      {enabledLanguages.map((lang) => {
        const flag = getFlagEmoji(lang);
        const isActive = lang === currentLanguage;
        return (
          <a
            key={lang}
            href={buildLanguageUrl(
              lang,
              defaultLanguage,
              enabledLanguages,
              currentPath,
            )}
            data-no-localize
            role="listitem"
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5",
              "text-sm transition-all duration-150",
              isActive
                ? cn(
                    "text-current font-medium opacity-100",
                    theme === "dark" ? "bg-white/10" : "bg-black/5",
                  )
                : "text-current opacity-50 hover:opacity-80",
            )}
          >
            {flag && <span className="text-sm leading-none">{flag}</span>}
            <span className="uppercase tracking-wide text-xs">{lang}</span>
          </a>
        );
      })}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────

export function LanguageSwitcher({
  variant = "compact",
  ...props
}: LanguageSwitcherProps) {
  // Don't render if only one language
  if (props.enabledLanguages.length <= 1) return null;

  return variant === "full" ? (
    <FullSwitcher {...props} />
  ) : (
    <CompactSwitcher {...props} />
  );
}
