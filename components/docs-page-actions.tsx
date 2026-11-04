"use client";

import { Check, ChevronDown, Copy, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import { fillUrl, type DocsUi } from "@/lib/docs-ui";

const OPEN_IN = [
  { name: "Claude", host: "claude.ai", href: (q: string) => `https://claude.ai/new?q=${q}` },
  { name: "Cursor", host: "cursor://", href: (q: string) => `cursor://anysphere.cursor-deeplink/prompt?text=${q}` },
];

// The page as Markdown: copied, opened, or handed to an assistant. The words
// come from the CMS like the rest of the shell; a language without them gets
// icons only.
export function DocsPageActions({ slug, ui }: { slug: string; ui: DocsUi }) {
  const { copied, copyLoaded } = useCopyToClipboard();
  const href = `${slug}.md`;

  const copyPage = () =>
    copyLoaded(async () => {
      const response = await fetch(href);
      if (!response.ok) throw new Error(`${href} answered ${response.status}`);
      return response.text();
    });

  const openIn = (build: (q: string) => string) => {
    const url = `${window.location.origin}${href}`;
    const target = build(encodeURIComponent(fillUrl(ui.openInPrompt, url)));
    window.open(target, "_blank", "noopener");
  };

  const openInLabel = ui.openIn ?? OPEN_IN.map((target) => target.name).join(" / ");

  const control =
    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground";

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={copyPage}
        className={control}
        aria-label={ui.copyPage}
        title={ui.copyPage}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? ui.copied : ui.copyPage}
      </button>
      <a
        href={href}
        className={control}
        aria-label={ui.viewMarkdown}
        title={ui.viewMarkdown}
      >
        <FileText className="size-3.5" />
        {ui.viewMarkdown}
      </a>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={control}
          aria-label={openInLabel}
          title={openInLabel}
        >
          {openInLabel}
          <ChevronDown className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="docs-shell min-w-48">
          {OPEN_IN.map((target) => (
            <DropdownMenuItem
              key={target.name}
              onSelect={() => openIn(target.href)}
              className="cursor-pointer"
            >
              <span className="inline-block size-2 rounded-[2px] bg-muted-foreground" />
              {target.name}
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                {target.host}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
