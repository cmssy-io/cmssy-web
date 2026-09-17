"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useCmssyLocale } from "@/components/cmssy-locale";
import { localizeHref } from "@cmssy/core";
import type { DocsUi } from "@/lib/docs-ui";
import {
  rankMatches,
  type DocsSearchBody,
  type DocsSearchItem,
} from "@/lib/docs-search-rank";

export const DOCS_SEARCH_EVENT = "cmssy:docs-search";

export type { DocsSearchItem } from "@/lib/docs-search-rank";

type BodyIndex = Map<string, string>;

const EMPTY_BODIES: BodyIndex = new Map();

const inFlight = new Map<string, Promise<BodyIndex>>();

function fetchBodyIndex(locale: string | undefined): Promise<BodyIndex> {
  const key = locale ?? "";
  const started = inFlight.get(key);
  if (started) return started;

  const url = locale
    ? `/api/docs-search?locale=${encodeURIComponent(locale)}`
    : "/api/docs-search";

  const request = fetch(url)
    .then((response) => (response.ok ? response.json() : null))
    .then((payload: { entries?: DocsSearchBody[] } | null) =>
      payload?.entries
        ? new Map(payload.entries.map((entry) => [entry.slug, entry.body]))
        : EMPTY_BODIES,
    )
    .catch((error) => {
      console.error("[cmssy-web] docs search index unavailable", error);
      inFlight.delete(key);
      return EMPTY_BODIES;
    });

  inFlight.set(key, request);
  return request;
}

function useBodyIndex(open: boolean, locale: string | undefined): BodyIndex {
  const [bodies, setBodies] = useState<BodyIndex>(EMPTY_BODIES);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetchBodyIndex(locale).then((index) => {
      if (!cancelled) setBodies(index);
    });
    return () => {
      cancelled = true;
    };
  }, [open, locale]);

  return bodies;
}

/**
 * Search over the section's own pages. The index is the nav the CMS already
 * gave us - title, section and description per page - so a page published
 * today is searchable today, with nothing to reindex.
 */
export function DocsSearch({
  items,
  label,
  ui,
}: {
  items: DocsSearchItem[];
  /** The section's own name, for the dialog's accessible name. */
  label: string;
  ui: DocsUi;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const locale = useCmssyLocale();
  const bodies = useBodyIndex(open, locale?.current);
  const matches = useMemo(
    () => rankMatches(items, bodies, query),
    [items, bodies, query],
  );

  const go = useCallback(
    (slug: string) => {
      setOpen(false);
      setQuery("");
      router.push(locale ? localizeHref(slug, locale) : slug);
    },
    [locale, router],
  );

  // The hero's search field (a CMS flag on the docs-hero block) opens the same
  // palette, so there is one index and one behaviour.
  useEffect(() => {
    const openSearch = () => setOpen(true);
    document.addEventListener(DOCS_SEARCH_EVENT, openSearch);
    return () => document.removeEventListener(DOCS_SEARCH_EVENT, openSearch);
  }, []);

  // "/" opens it the way every docs site does; Escape closes it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (
        !open &&
        !typing &&
        (event.key === "/" ||
          (event.key === "k" && (event.metaKey || event.ctrlKey)))
      ) {
        event.preventDefault();
        setOpen(true);
      }
      if (open && event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => setActive(0), [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate">{ui.searchPlaceholder}</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 font-mono text-[10px] sm:block">
          /
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]">
          <button
            type="button"
            aria-label={ui.searchClose}
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActive((i) => Math.min(i + 1, matches.length - 1));
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActive((i) => Math.max(i - 1, 0));
                  }
                  if (event.key === "Enter" && matches[active]) {
                    go(matches[active].slug);
                  }
                }}
                placeholder={ui.searchPlaceholder}
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {query && (
              <ul className="max-h-[60vh] overflow-y-auto py-2">
                {matches.length === 0 && ui.searchEmpty && (
                  <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                    {ui.searchEmpty}
                  </li>
                )}
                {matches.map((item, i) => (
                  <li key={item.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(item.slug)}
                      className={`flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left ${
                        i === active ? "bg-muted" : ""
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.section}
                        {item.description ? ` - ${item.description}` : ""}
                      </span>
                      {item.snippet && (
                        <span className="line-clamp-2 text-xs text-muted-foreground/80">
                          {item.snippet}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
