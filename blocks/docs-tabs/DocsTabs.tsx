"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { getLucideIcon } from "@/components/get-lucide-icon";
import { hasCode, resolveTabIndex } from "@/lib/docs-tab-sync";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import { useSyncedTab } from "@/lib/use-synced-tab";
import type { docsTabsProps, DocsTabsData } from "./block";

export default function DocsTabs({
  content,
  data,
}: BlockProps<typeof docsTabsProps, DocsTabsData>) {
  const { tabs = [], defaultTab = 0, variant = "underline", syncKey } = content;

  const [localTab, setLocalTab] = useState(defaultTab);
  const { chosen, choose } = useSyncedTab(syncKey || undefined);
  const { copied, copy } = useCopyToClipboard();
  const panelRef = useRef<HTMLDivElement>(null);

  const activeTab = resolveTabIndex(
    tabs.map((tab) => tab.label),
    chosen,
    localTab,
  );

  if (tabs.length === 0) {
    return (
      <Container className="py-6">
        <div data-block="docs-tabs-empty" />
      </Container>
    );
  }

  const activeContent =
    data?.tabsHtml?.[activeTab] ?? tabs[activeTab]?.content ?? "";

  return (
    <Container className="py-6">
      <div
        className={
          variant === "bordered" ? "rounded-lg border overflow-hidden" : ""
        }
      >
        <div
          className={`flex items-center justify-between gap-2 ${
            variant === "underline"
              ? "border-b"
              : variant === "pills"
                ? "mb-4"
                : "border-b bg-muted/30"
          }`}
        >
          <div
            className={`flex gap-0 ${
              variant === "pills"
                ? "gap-1 p-1 rounded-lg bg-muted/50 inline-flex"
                : ""
            }`}
            role="tablist"
          >
            {tabs.map((tab, index) => {
              const isActive = index === activeTab;
              const Icon = getLucideIcon(tab.icon);

              const baseClasses =
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer outline-hidden";

              const variantClasses = {
                underline: isActive
                  ? "text-foreground border-b-2 border-primary -mb-px"
                  : "text-muted-foreground hover:text-foreground -mb-px border-b-2 border-transparent",
                pills: isActive
                  ? "text-foreground bg-background rounded-md shadow-sm"
                  : "text-muted-foreground hover:text-foreground rounded-md",
                bordered: isActive
                  ? "text-foreground bg-background border-b-2 border-primary -mb-px"
                  : "text-muted-foreground hover:text-foreground -mb-px border-b-2 border-transparent",
              };

              return (
                <button
                  key={index}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => {
                    setLocalTab(index);
                    choose(tab.label);
                  }}
                  className={`${baseClasses} ${variantClasses[variant]}`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
          {hasCode(activeContent) && (
            <button
              type="button"
              onClick={() =>
                copy(
                  Array.from(
                    panelRef.current?.querySelectorAll("pre") ?? [],
                    (pre) => pre.textContent ?? "",
                  ).join("\n\n"),
                )
              }
              className="mr-2 flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-primary" />
                  <span className="text-primary">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        <div
          role="tabpanel"
          className={variant === "bordered" ? "p-6" : "pt-4"}
        >
          <div
            ref={panelRef}
            className="prose prose-sm max-w-none
              prose-p:my-2 prose-p:leading-relaxed
              prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg
              prose-code:text-xs
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-ul:my-2 prose-li:my-0
            "
            dangerouslySetInnerHTML={{ __html: activeContent }}
          />
        </div>
      </div>
    </Container>
  );
}
