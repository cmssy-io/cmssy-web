"use client";

import { Search } from "lucide-react";
import { DOCS_SEARCH_EVENT } from "./docs-search";

/**
 * The docs hero's search field. It opens the palette that the sidebar owns,
 * rather than carrying a second index of its own.
 */
export function DocsSearchTrigger({ placeholder }: { placeholder: string }) {
  return (
    <button
      type="button"
      onClick={() => document.dispatchEvent(new CustomEvent(DOCS_SEARCH_EVENT))}
      className="mx-auto mt-8 flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-foreground"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="truncate">{placeholder}</span>
      <kbd className="ml-auto hidden rounded border border-border px-1.5 font-mono text-[10px] sm:block">
        /
      </kbd>
    </button>
  );
}
