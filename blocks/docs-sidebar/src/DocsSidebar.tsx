"use client";
import {
  ExternalLink,
  Github,
  Menu,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "../../../components/language-switcher";
import { BlockContent } from "./block";

type PageEntry =
  | string
  | { slug: string; displayName?: Record<string, string> };

interface PlatformContext {
  locale?: {
    current: string;
    default: string;
    enabled: string[];
    localizeHref?: (href: string) => string;
  };
}

/** Extract slug from a page entry (string or object). */
function getPageSlug(entry: PageEntry): string {
  return typeof entry === "string" ? entry : entry.slug;
}

/** Get display label for a page entry, respecting current language. */
function getPageLabel(entry: PageEntry, language?: string): string {
  if (typeof entry === "object" && entry.displayName) {
    const label =
      (language && entry.displayName[language]) ||
      entry.displayName.en ||
      Object.values(entry.displayName)[0];
    if (label) return label;
  }
  return formatSlugAsLabel(getPageSlug(entry));
}

function formatSlugAsLabel(slug: string): string {
  const clean = slug.replace(/^\//, "");
  if (!clean) return "Home";
  const last = clean.split("/").pop() || clean;
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getCurrentPageLabel(
  sections: BlockContent["sections"],
  currentPath: string,
  language?: string,
): string {
  for (const section of sections || []) {
    for (const entry of section.pages || []) {
      if (getPageSlug(entry) === currentPath)
        return getPageLabel(entry, language);
    }
  }
  return "Documentation";
}

// Shared sidebar content (used in both desktop aside and mobile drawer)
function SidebarContent({
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
}: {
  sections: BlockContent["sections"];
  showSearch: boolean;
  searchPlaceholder: string;
  logo?: string;
  logoText: string;
  logoUrl: string;
  showVersionSelector: boolean;
  currentVersion: string;
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
}) {
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
        <a
          href={logoUrl}
          onClick={onNavigate}
          className="flex items-center gap-2.5 text-foreground no-underline hover:opacity-80 transition-opacity"
        >
          {logo && (
            <img src={logo} alt="" className="size-6 rounded-xs object-cover" />
          )}
          <span className="text-[15px] font-semibold tracking-tight">
            {logoText}
          </span>
        </a>
        {showVersionSelector && (
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
                      <a
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
                      </a>
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
              variant="compact"
              className="ml-auto"
            />
          )}
        </div>
      )}
    </>
  );
}

export default function DocsSidebar({
  content,
  context,
}: {
  content: BlockContent;
  context?: PlatformContext;
}) {
  const {
    logo,
    logoText = "Docs",
    logoUrl = "/",
    sections = [],
    showSearch = true,
    searchPlaceholder = "Search docs...",
    showVersionSelector = false,
    currentVersion = "v1.0",
    githubUrl,
    slackUrl,
    showLanguageSwitcher = false,
  } = content;

  const i18n = context?.locale
    ? {
        enabledLanguages: context.locale.enabled,
        defaultLanguage: context.locale.default,
        currentLanguage: context.locale.current,
      }
    : undefined;
  const language = i18n?.currentLanguage;
  const hasLanguageSwitcher =
    showLanguageSwitcher && !!i18n && i18n.enabledLanguages.length > 1;

  const [mobileOpen, setMobileOpen] = useState(false);
  // Read pathname client-side after mount. Reading window.location during
  // render produces SSR="" vs client=<pathname> -> different "active" item
  // -> React #418 (hydration mismatch). Effect runs once after hydration
  // and the highlight resolves on the second client render.
  const [rawPath, setRawPath] = useState("");
  useEffect(() => {
    setRawPath(window.location.pathname);
  }, []);
  // Strip language prefix so active state matches slugs (e.g. /pl/docs/x → /docs/x)
  let currentPath = rawPath;
  if (i18n) {
    const match = rawPath.match(/^\/([a-z]{2})(?:\/|$)/);
    if (match && i18n.enabledLanguages.includes(match[1]!)) {
      currentPath = rawPath.slice(match[1]!.length + 1) || "/";
    }
  }
  const currentPageLabel = getCurrentPageLabel(sections, currentPath, language);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

  const sharedProps = {
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
  };

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex flex-col h-full bg-background">
        <SidebarContent {...sharedProps} />
      </aside>

      {/* Mobile top bar — visible only on mobile */}
      <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-12 bg-background/95 backdrop-blur-sm border-b border-border">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center size-8 -ml-1 rounded-md hover:bg-muted transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="size-5 text-foreground" />
        </button>
        <span className="text-sm font-medium text-foreground truncate">
          {currentPageLabel}
        </span>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="relative flex flex-col w-70 max-w-[85vw] h-full bg-background shadow-xl animate-in slide-in-from-left duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 z-10 flex items-center justify-center size-8 rounded-md hover:bg-muted transition-colors"
              aria-label="Close navigation"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
            <SidebarContent
              {...sharedProps}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
