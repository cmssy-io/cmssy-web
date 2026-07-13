"use client";

import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          data-slot="language-switcher"
          className={cn("gap-1.5", className)}
          aria-label="Select language"
        >
          <Globe className="size-4" />
          <span className="text-xs uppercase">{currentLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {enabled.map((lang) => {
          const isActive = lang === currentLanguage;
          return (
            <DropdownMenuItem key={lang} asChild>
              <a
                href={buildLocaleSwitchHref(lang, pathname, localeCtx)}
                data-no-localize
                className={cn(
                  "capitalize",
                  isActive && "bg-accent font-medium",
                )}
              >
                {getLanguageName(lang)}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
