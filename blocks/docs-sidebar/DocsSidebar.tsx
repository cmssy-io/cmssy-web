"use client";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { type BlockProps, splitLocaleFromPath } from "@cmssy/react";
import type { docsSidebarProps } from "./block";
import { getCurrentPageLabel } from "./nav-utils";
import { SidebarContent } from "./SidebarContent";

export default function DocsSidebar({
  content,
  context,
}: BlockProps<typeof docsSidebarProps>) {
  const {
    logo,
    logoText,
    logoUrl = "/",
    sections = [],
    showSearch = true,
    searchPlaceholder,
    showVersionSelector = false,
    currentVersion,
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
  if (i18n && rawPath) {
    const { path } = splitLocaleFromPath(rawPath.split("/").filter(Boolean), {
      defaultLocale: i18n.defaultLanguage,
      locales: i18n.enabledLanguages,
    });
    currentPath = `/${(path ?? []).join("/")}`;
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
