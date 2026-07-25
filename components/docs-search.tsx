"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useCmssyLocale } from "@/components/cmssy-locale";
import { localizeHref } from "@cmssy/core";

export const DOCS_SEARCH_EVENT = "cmssy:docs-search";

export type DocsSearchItem = {
  slug: string;
  label: string;
  section: string;
  description?: string;
};

/** Every field a reader might type against, lowercased once. */
function haystack(item: DocsSearchItem): string {
  return `${item.label} ${item.section} ${item.slug} ${item.description ?? ""}`.toLowerCase();
}

function useMatches(items: DocsSearchItem[], query: string): DocsSearchItem[] {
  const indexed = useMemo(
    () => items.map((item) => ({ item, text: haystack(item) })),
    [items],
  );
  return useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return indexed
      .filter(({ text }) => terms.every((term) => text.includes(term)))
      .slice(0, 12)
      .map(({ item }) => item);
  }, [indexed, query]);
}

/**
 * Search over the section's own pages. The index is the nav the CMS already
 * gave us - title, section and description per page - so a page published
 * today is searchable today, with nothing to reindex.
 */
export function DocsSearch({
  items,
  placeholder,
  label,
}: {
  items: DocsSearchItem[];
  placeholder: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const locale = useCmssyLocale();
  const matches = useMatches(items, query);

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
        <span className="truncate">{placeholder}</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 font-mono text-[10px] sm:block">
          /
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]">
          <button
            type="button"
            aria-label="Close search"
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
                placeholder={placeholder}
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {query && (
              <ul className="max-h-[60vh] overflow-y-auto py-2">
                {matches.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                    {/* Nothing invented: the CMS has no page matching this. */}
                    No matches
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
