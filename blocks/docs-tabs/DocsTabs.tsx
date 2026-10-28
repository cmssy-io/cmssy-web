"use client";

import { useId, useRef, useState } from "react";
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
  const [copiedTab, setCopiedTab] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = `${baseId}-panel`;

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

  const selectTab = (index: number) => {
    setLocalTab(index);
    choose(tabs[index].label);
  };

  const copyActiveCode = async () => {
    const code = Array.from(
      panelRef.current?.querySelectorAll("pre") ?? [],
      (pre) => pre.textContent ?? "",
    ).join("\n\n");
    if (await copy(code)) setCopiedTab(activeTab);
  };

  return (
    <Container className="py-6">
      <div
        className={
          variant === "bordered" ? "rounded-lg border overflow-hidden" : ""
        }
      >
        <div
          className={`flex min-w-0 items-center justify-between gap-2 ${
            variant === "underline"
              ? "border-b"
              : variant === "pills"
                ? "mb-4"
                : "border-b bg-muted/30"
          }`}
        >
          <div
            className={`flex min-w-0 gap-0 overflow-x-auto ${
              variant === "pills" ? "gap-1 p-1 rounded-lg bg-muted/50" : ""
            }`}
            role="tablist"
            aria-orientation="horizontal"
          >
            {tabs.map((tab, index) => {
              const isActive = index === activeTab;
              const Icon = getLucideIcon(tab.icon);

              const baseClasses =
                "flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer outline-hidden";

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
                  id={tabId(index)}
                  aria-controls={panelId}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(event) => {
                    const step =
                      event.key === "ArrowRight"
                        ? 1
                        : event.key === "ArrowLeft"
                          ? -1
                          : 0;
                    if (!step) return;
                    event.preventDefault();
                    const next = (activeTab + step + tabs.length) % tabs.length;
                    selectTab(next);
                    document.getElementById(tabId(next))?.focus();
                  }}
                  onClick={() => selectTab(index)}
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
              onClick={copyActiveCode}
              className="mr-2 flex shrink-0 items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied && copiedTab === activeTab ? (
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
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(activeTab)}
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
