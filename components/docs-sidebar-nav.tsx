"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
import type { DocsNavSection } from "@/lib/docs-nav";

// Auto docs sidebar: rendered from the page tree (see lib/docs-nav.ts), not a
// hand-authored block. Desktop: a sticky rail. Mobile: a collapsible drawer
// behind a menu button so the nav never pushes the page content down.
export function DocsSidebarNav({ sections }: { sections: DocsNavSection[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Locale-agnostic active matching: strip anything before the docs root.
  const idx = pathname.indexOf("/docs");
  const path = idx >= 0 ? pathname.slice(idx) : pathname;

  return (
    <nav aria-label="Documentation" className="text-sm">
      {/* Mobile bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
        <CmssyLink href="/docs" className="font-semibold text-foreground">
          cmssy docs
        </CmssyLink>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle documentation navigation"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Desktop header */}
      <CmssyLink
        href="/docs"
        className="hidden px-4 pb-4 pt-6 font-semibold text-foreground md:block"
      >
        cmssy docs
      </CmssyLink>

      {/* Link list: always shown on desktop, toggled on mobile */}
      <div className={`${open ? "block" : "hidden"} px-4 pb-6 md:block`}>
        <div className="flex flex-col gap-1">
          {sections.map((section) => {
            const single =
              section.pages.length === 1 && section.pages[0].isIndex;

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
      </div>
    </nav>
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
