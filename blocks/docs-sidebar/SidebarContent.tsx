"use client";
import {
  ExternalLink,
  Github,
  Menu,
  MessageCircle,
  Search,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { CmssyLink } from "@cmssy/next/client";
import type { BlockProps } from "@cmssy/react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { docsSidebarProps } from "./block";
import { getPageLabel, getPageSlug } from "./nav-utils";

type BlockContent = BlockProps<typeof docsSidebarProps>["content"];

interface SidebarContentProps {
  sections: BlockContent["sections"];
  showSearch: boolean;
  searchPlaceholder?: string;
  logo?: string;
  logoText?: string;
  logoUrl: string;
  showVersionSelector: boolean;
  currentVersion?: string;
  githubUrl?: string;
  slackUrl?: string;
  hasLanguageSwitcher: boolean;
  i18n?: {
    enabledLanguages: string[];
    defaultLanguage: string;
    currentLanguage: string;
  };
  language?: string;
  currentPath: string;
  onNavigate?: () => void;
}

// Shared sidebar content (used in both desktop aside and mobile drawer)
export function SidebarContent({
  sections,
  showSearch,
  searchPlaceholder,
  logo,
  logoText,
  logoUrl,
  showVersionSelector,
  currentVersion,
  githubUrl,
  slackUrl,
  hasLanguageSwitcher,
  i18n,
  language,
  currentPath,
  onNavigate,
}: SidebarContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const matchesSearch = useCallback(
    (label: string, slug: string) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return label.toLowerCase().includes(q) || slug.toLowerCase().includes(q);
    },
    [searchQuery],
  );

  return (
    <>
      {/* Header: Logo + Version */}
      <div className="flex items-center gap-3 px-5 h-14 shrink-0 border-b border-border">
        <CmssyLink
          href={logoUrl}
          onClick={onNavigate}
          className="flex items-center gap-2.5 text-foreground no-underline hover:opacity-80 transition-opacity"
        >
          {logo && (
            <Image
              src={logo}
              alt=""
              width={24}
              height={24}
              className="size-6 rounded-xs object-cover"
            />
          )}
          {logoText && (
            <span className="text-[15px] font-semibold tracking-tight">
              {logoText}
            </span>
          )}
        </CmssyLink>
        {showVersionSelector && currentVersion && (
          <span className="ml-auto text-[10px] font-medium tracking-wide uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
            {currentVersion}
          </span>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="px-4 py-3 shrink-0">
          <div
            className={`relative flex items-center rounded-lg border transition-colors duration-150 ${
              searchFocused
                ? "border-ring bg-background ring-[3px] ring-ring/20"
                : "border-border bg-muted/50 hover:bg-muted"
            }`}
          >
            <Search className="absolute left-3 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent pl-9 pr-12 py-2 text-sm outline-hidden placeholder:text-muted-foreground/60"
            />
            <kbd className="absolute right-3 text-[10px] font-medium text-muted-foreground/50 tracking-wide pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-2 space-y-5"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)",
        }}
      >
        {sections?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-3">
              <Menu className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No sections configured
            </p>
          </div>
        )}

        {sections?.map((section, si) => {
          const entries = section.pages || [];

          const filtered = entries.filter((entry) =>
            matchesSearch(getPageLabel(entry, language), getPageSlug(entry)),
          );

          if (filtered.length === 0 && searchQuery) return null;

          return (
            <div key={si}>
              <h3 className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest px-2 mb-1.5">
                {section.title}
              </h3>
              <ul className="space-y-px">
                {filtered.map((entry) => {
                  const slug = getPageSlug(entry);
                  const label = getPageLabel(entry, language);
                  const isActive = currentPath === slug;
                  return (
                    <li key={slug}>
                      <CmssyLink
                        href={slug}
                        onClick={onNavigate}
                        className={`group relative flex items-center gap-2 pl-3 pr-2 py-1.5 text-[13px] rounded-md transition-all duration-150 no-underline ${
                          isActive
                            ? "bg-primary/8 text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                        }`}
                      >
                        {/* Active indicator bar */}
                        <span
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.75 rounded-full transition-all duration-200 ${
                            isActive
                              ? "h-4 bg-primary opacity-100"
                              : "h-0 bg-primary opacity-0 group-hover:h-2 group-hover:opacity-40"
                          }`}
                        />
                        <span className="truncate">{label}</span>
                      </CmssyLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {searchQuery &&
          sections?.every((s) =>
            (s.pages || []).every(
              (entry) =>
                !matchesSearch(
                  getPageLabel(entry, language),
                  getPageSlug(entry),
                ),
            ),
          ) && (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground/50">
                No results for &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          )}
      </nav>

      {/* Footer links + Language Switcher */}
      {(githubUrl || slackUrl || hasLanguageSwitcher) && (
        <div className="px-4 py-3 border-t border-border flex items-center gap-1 shrink-0">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors no-underline"
            >
              <Github className="size-3.5" />
              <span>GitHub</span>
              <ExternalLink className="size-2.5 opacity-40" />
            </a>
          )}
          {slackUrl && (
            <a
              href={slackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors no-underline"
            >
              <MessageCircle className="size-3.5" />
              <span>Slack</span>
              <ExternalLink className="size-2.5 opacity-40" />
            </a>
          )}
          {hasLanguageSwitcher && i18n && (
            <LanguageSwitcher
              enabledLanguages={i18n.enabledLanguages}
              defaultLanguage={i18n.defaultLanguage}
              currentLanguage={i18n.currentLanguage}
              className="ml-auto"
            />
          )}
        </div>
      )}
    </>
  );
}
