"use client";

import { useEffect, useRef, useState } from "react";
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
  const hidden = useHideOnScrollDown(pathname);
  const { ref: navRef, overflow, measure } = useOverflow<HTMLElement>();

  return (
    <div
      data-hidden={hidden || undefined}
      className="sticky top-[var(--site-chrome,4rem)] z-40 border-b border-border bg-background max-md:transition-[transform,visibility] max-md:duration-200 motion-reduce:transition-none max-md:data-hidden:invisible max-md:data-hidden:-translate-y-full"
    >
      <div className="container flex h-12 items-stretch gap-3 sm:gap-5">
        <CmssyLink
          href={root.slug}
          className="flex shrink-0 items-center gap-2.5 font-heading text-[15px] font-semibold text-foreground sm:border-r sm:border-border sm:pr-5"
        >
          <span className="inline-block size-1.5 rounded-[2px] bg-elektryk" />
          <span className="max-sm:sr-only">{root.label}</span>
        </CmssyLink>
        <nav
          ref={navRef}
          aria-label={root.label}
          onScroll={measure}
          data-overflow={overflow}
          className="no-scrollbar -mb-px flex min-w-0 gap-0.5 overflow-x-auto data-[overflow=true]:[mask-image:linear-gradient(to_right,black_82%,transparent)]"
        >
          {areas.map((area) => {
            const active = area.slug === activeSlug;
            return (
              <CmssyLink
                key={area.slug}
                href={area.slug}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center border-b-2 px-2.5 text-sm transition-colors duration-[160ms] motion-reduce:transition-none ${
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
        <div className="docs-tabs-search ml-auto flex shrink-0 items-center">
          <DocsSearch items={searchItems} label={root.label} ui={ui} compact />
        </div>
      </div>
    </div>
  );
}

function useOverflow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [overflow, setOverflow] = useState<"false" | "true" | "end">("false");

  const measure = () => {
    const el = ref.current;
    if (!el) return;
    const slack = el.scrollWidth - el.clientWidth;
    if (slack <= 2) return setOverflow("false");
    setOverflow(el.scrollLeft >= slack - 2 ? "end" : "true");
  };

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, overflow, measure };
}

function useHideOnScrollDown(resetKey: string): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
    const narrow = window.matchMedia("(max-width: 767px)");
    let last = window.scrollY;
    let settleUntil = 0;
    const onHash = () => {
      settleUntil = Date.now() + 400;
    };
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < 6) return;
      last = y;
      if (Date.now() < settleUntil) return;
      setHidden(narrow.matches && delta > 0 && y > 48);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("scroll", onScroll);
    };
  }, [resetKey]);

  return hidden;
}
