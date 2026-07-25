"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CmssyLink } from "./cmssy-locale";
import type { DocsNavSection } from "@/lib/docs-nav";

// Auto docs sidebar: rendered from the page tree (see lib/docs-nav.ts), not a
// hand-authored block. Desktop: a sticky rail. Mobile: a sticky bar plus an
// overlay drawer that slides in over the content (never pushes it down).
export function DocsSidebarNav({ sections }: { sections: DocsNavSection[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Drawer is portaled to <body> so no ancestor stacking context (the CMS
  // header block sits at z-50) can paint over it.
  useEffect(() => setMounted(true), []);
  // Locale-agnostic active matching: strip anything before the docs root.
  const idx = pathname.indexOf("/docs");
  const path = idx >= 0 ? pathname.slice(idx) : pathname;

  // Close on route change so a tap on a link never leaves the drawer open.
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes; body scroll stays locked while the drawer covers the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const links = (
    <div className="flex flex-col gap-1">
      {sections.map((section) => {
        const single = section.pages.length === 1 && section.pages[0].isIndex;

        if (single) {
          const page = section.pages[0];
          return (
            <NavLink
              key={section.key}
              href={page.slug}
              label={page.label}
              active={path === page.slug}
              onNavigate={() => setOpen(false)}
            />
          );
        }

        return (
          <div
            key={section.key}
            className="mt-6 flex flex-col gap-0.5 first:mt-0"
          >
            <span className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.label}
            </span>
            {section.pages.map((page) => (
              <NavLink
                key={page.slug}
                href={page.slug}
                label={page.label}
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
      <div className="flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
        <CmssyLink href="/docs" className="font-semibold text-foreground">
          cmssy docs
        </CmssyLink>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="docs-mobile-nav"
          aria-label="Open documentation navigation"
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
              aria-label="Close documentation navigation"
              onClick={() => setOpen(false)}
              className={`absolute inset-0 h-full w-full cursor-default bg-black/50 transition-opacity duration-200 ${
                open ? "opacity-100" : "opacity-0"
              }`}
            />
            <nav
              id="docs-mobile-nav"
              aria-label="Documentation"
              className={`absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto overscroll-contain border-r border-border bg-background text-sm shadow-xl transition-transform duration-200 ease-out ${
                open ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <CmssyLink
                  href="/docs"
                  className="font-semibold text-foreground"
                >
                  cmssy docs
                </CmssyLink>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close documentation navigation"
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
      <nav aria-label="Documentation" className="hidden text-sm md:block">
        <CmssyLink
          href="/docs"
          className="block px-4 pb-4 pt-6 font-semibold text-foreground"
        >
          cmssy docs
        </CmssyLink>
        <div className="px-4 pb-6">{links}</div>
      </nav>
    </>
  );
}

function NavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <CmssyLink
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "rounded-md bg-primary/10 px-2 py-1.5 font-medium text-primary"
          : "rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      }
    >
      {label}
    </CmssyLink>
  );
}
