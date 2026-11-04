"use client";

import { usePathname } from "next/navigation";
import { CmssyLink } from "./cmssy-locale";
import { DocsSearch, type DocsSearchItem } from "./docs-search";
import { areaForSlug, pathWithin, type DocsArea } from "@/lib/docs-nav";
import type { DocsUi } from "@/lib/docs-ui";

export function DocsAreaTabs({
  root,
  areas,
  searchItems,
  ui,
}: {
  root: { slug: string; label: string };
  areas: DocsArea[];
  searchItems: DocsSearchItem[];
  ui: DocsUi;
}) {
  const pathname = usePathname();
  const activeSlug = areaForSlug(pathWithin(pathname, root.slug), areas)?.slug;

  return (
    <div className="sticky top-[var(--site-chrome,4rem)] z-40 border-b border-border bg-background">
      <div className="container flex h-[var(--docs-area-tabs,3rem)] items-stretch gap-3 sm:gap-5">
        <CmssyLink
          href={root.slug}
          className="flex shrink-0 items-center gap-2.5 border-r border-border pr-3 font-heading text-[15px] font-semibold text-foreground sm:pr-5"
        >
          <span className="inline-block size-1.5 rounded-[2px] bg-elektryk" />
          {root.label}
        </CmssyLink>
        <nav
          aria-label={root.label}
          className="no-scrollbar -mb-px flex min-w-0 gap-0.5 overflow-x-auto"
        >
          {areas.map((area) => {
            const active = area.slug === activeSlug;
            return (
              <CmssyLink
                key={area.slug}
                href={area.slug}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center border-b-2 px-2.5 text-sm transition-colors duration-[160ms] ${
                  active
                    ? "border-elektryk text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {area.label}
              </CmssyLink>
            );
          })}
        </nav>
        <div className="ml-auto flex shrink-0 items-center">
          <DocsSearch items={searchItems} label={root.label} ui={ui} compact />
        </div>
      </div>
    </div>
  );
}
