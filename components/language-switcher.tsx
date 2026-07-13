"use client";

import { usePathname } from "next/navigation";
import { Check, Globe } from "lucide-react";
import { buildLocaleSwitchHref } from "@cmssy/react";
import { useCmssyLocale } from "@cmssy/react/client";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "../lib/utils";

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

interface LanguageSwitcherProps {
  /** All enabled language codes */
  enabledLanguages: string[];
  /** Workspace default language (clean URLs) */
  defaultLanguage: string;
  /** Currently active language */
  currentLanguage: string;
  /** Additional class names for the root element */
  className?: string;
}

export function LanguageSwitcher({
  enabledLanguages,
  defaultLanguage,
  currentLanguage,
  className,
}: LanguageSwitcherProps) {
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
  const activeFlag = getFlagEmoji(currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-slot="language-switcher"
          className={cn("gap-1.5 font-medium", className)}
          aria-label="Select language"
        >
          {activeFlag ? (
            <span className="text-sm">{activeFlag}</span>
          ) : (
            <Globe className="size-3.5" />
          )}
          {currentLanguage.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {enabled.map((lang) => {
          const flag = getFlagEmoji(lang);
          const isActive = lang === currentLanguage;
          return (
            <DropdownMenuItem key={lang} asChild>
              <a
                href={buildLocaleSwitchHref(lang, pathname, localeCtx)}
                data-no-localize
                className={cn("gap-2", isActive && "font-semibold")}
              >
                <Check className={cn("size-3.5", !isActive && "invisible")} />
                {flag && <span className="text-sm">{flag}</span>}
                <span className="capitalize">{getLanguageName(lang)}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {lang.toUpperCase()}
                </span>
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
