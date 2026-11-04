"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CmssyLink } from "./cmssy-locale";
import { pathWithin, type DocsArea, type DocsNavSection } from "@/lib/docs-nav";
import { fillCount, type DocsUi } from "@/lib/docs-ui";
import { trapModal } from "@/lib/modal-focus";

// Auto docs sidebar: rendered from the page tree (see lib/docs-nav.ts), not a
// hand-authored block, and scoped to the area the tab bar has active.
// Desktop: a sticky rail. Mobile: a sticky bar plus an overlay drawer that
// slides in over the content (never pushes it down).
export function DocsSidebarNav({
  area,
  sections,
  ui,
}: {
  area: DocsArea;
  sections: DocsNavSection[];
  ui: DocsUi;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Drawer is portaled to <body> so no ancestor stacking context (the CMS
  // header block sits at z-50) can paint over it.
  useEffect(() => setMounted(true), []);
  const path = pathWithin(pathname, area.slug);

  // Close on route change so a tap on a link never leaves the drawer open.
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes; while open the rest of the page is inert, scroll is locked
  // and focus moves into the drawer and back to the trigger afterwards.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const release = trapModal(drawerRef.current, closeRef.current);
    return () => {
      document.removeEventListener("keydown", onKey);
      release();
    };
  }, [open]);

  const count = fillCount(ui.pageCount, area.pageCount);

  const heading = (
    <div className="flex items-baseline justify-between gap-3 px-2 pb-3">
      <CmssyLink
        href={area.slug}
        className="font-heading text-[15px] font-semibold text-foreground"
      >
        {area.label}
      </CmssyLink>
      {count ? (
        <span className="font-mono text-label text-muted-foreground">
          {count}
        </span>
      ) : null}
    </div>
  );

  const links = (
    <div className="flex flex-col gap-0.5">
      {sections.map((section) => {
        const single = section.pages.length === 1 && section.pages[0].isIndex;

        if (single) {
          const page = section.pages[0];
          const isAreaIndex = page.slug === area.slug;
          return (
            <NavLink
              key={section.slug}
              href={page.slug}
              label={isAreaIndex && ui.overview ? ui.overview : page.label}
              active={path === page.slug}
              onNavigate={() => setOpen(false)}
            />
          );
        }

        return (
          <div
            key={section.slug}
            className="mt-5 flex flex-col gap-0.5 first:mt-0"
          >
            <span className="mb-1 px-2 font-mono text-label uppercase tracking-[0.12em] text-muted-foreground">
              {section.label}
            </span>
            {section.pages.map((page) => (
              <NavLink
                key={page.slug}
                href={page.slug}
                label={page.slug === area.slug && ui.overview ? ui.overview : page.label}
                depth={page.depth}
                active={path === page.slug}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile bar — the wrapping <aside> makes it stick while reading */}
      <div className="flex items-center justify-between border-b border-border bg-background/90 px-4 py-2.5 backdrop-blur md:hidden">
        <CmssyLink
          href={area.slug}
          className="font-heading font-semibold text-foreground"
        >
          {area.label}
        </CmssyLink>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="docs-mobile-nav"
          aria-label={ui.navOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer — fixed overlay above the content */}
      {mounted &&
        createPortal(
          <div
            // `docs-shell` re-applies the docs token palette outside the shell.
            className={`docs-shell fixed inset-0 z-[90] md:hidden ${
              open ? "visible" : "invisible delay-200"
            }`}
          >
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              aria-label={ui.navClose}
              onClick={() => setOpen(false)}
              className={`absolute inset-0 h-full w-full cursor-default bg-black/50 transition-opacity duration-200 motion-reduce:transition-none ${
                open ? "opacity-100" : "opacity-0"
              }`}
            />
            <nav
              ref={drawerRef}
              id="docs-mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label={area.label}
              className={`absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto overscroll-contain border-r border-border bg-background text-sm shadow-xl transition-transform duration-200 ease-out motion-reduce:transition-none ${
                open ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <CmssyLink
                  href={area.slug}
                  className="py-2 font-heading font-semibold text-foreground"
                >
                  {area.label}
                </CmssyLink>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={ui.navClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 py-4">{links}</div>
            </nav>
          </div>,
          document.body,
        )}

      {/* Desktop rail */}
      <nav
        aria-label={area.label}
        className="hidden pl-4 pr-4 pt-5 text-sm md:block lg:pl-6"
      >
        {heading}
        <div className="px-2 pb-6">{links}</div>
      </nav>
    </>
  );
}

const INDENT: Record<number, string> = { 2: "pl-5", 3: "pl-8" };

function NavLink({
  href,
  label,
  depth = 1,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  depth?: number;
  active: boolean;
  onNavigate: () => void;
}) {
  const indent = INDENT[Math.min(depth, 3)] ?? "pl-2";
  return (
    <CmssyLink
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`-ml-0.5 border-l-2 py-1.5 pr-2 ${indent} ${
        active
          ? "rounded-r-md border-elektryk bg-primary/5 font-medium text-primary"
          : "rounded-md border-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </CmssyLink>
  );
}
