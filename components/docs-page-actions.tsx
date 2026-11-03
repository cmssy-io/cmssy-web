"use client";

import { Check, Copy, FileText } from "lucide-react";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import type { DocsUi } from "@/lib/docs-ui";

// The page as Markdown, for pasting into an AI assistant. The words come from
// the CMS like the rest of the shell; without them the icons still work.
export function DocsPageActions({ slug, ui }: { slug: string; ui: DocsUi }) {
  const { copied, copyLoaded } = useCopyToClipboard();
  const href = `${slug}.md`;

  const copyPage = () =>
    copyLoaded(async () => {
      const response = await fetch(href);
      if (!response.ok) throw new Error(`${href} answered ${response.status}`);
      return response.text();
    });

  const control =
    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground";

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={copyPage}
        className={control}
        aria-label={ui.copyPage ?? "Copy page as Markdown"}
        title={ui.copyPage ?? "Copy page as Markdown"}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? ui.copied : ui.copyPage}
      </button>
      <a
        href={href}
        className={control}
        aria-label={ui.viewMarkdown ?? "View as Markdown"}
        title={ui.viewMarkdown ?? "View as Markdown"}
      >
        <FileText className="size-3.5" />
        {ui.viewMarkdown}
      </a>
    </div>
  );
}
