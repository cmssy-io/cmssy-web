import { useState } from "react";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";

function getIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon || null;
}

export default function DocsTabs({ content }: { content: BlockContent }) {
  const { tabs = [], defaultTab = 0, variant = "underline" } = content;

  const [activeTab, setActiveTab] = useState(
    Math.min(defaultTab, Math.max(0, tabs.length - 1)),
  );

  if (tabs.length === 0) {
    return (
      <Container className="py-6">
        <div data-block="docs-tabs-empty" />
      </Container>
    );
  }

  const activeContent = tabs[activeTab]?.content || "";

  return (
    <Container className="py-6">
      <div
        className={
          variant === "bordered" ? "rounded-lg border overflow-hidden" : ""
        }
      >
        {/* Tab bar */}
        <div
          className={`flex gap-0 ${
            variant === "underline"
              ? "border-b"
              : variant === "pills"
                ? "gap-1 p-1 rounded-lg bg-muted/50 inline-flex mb-4"
                : "border-b bg-muted/30"
          }`}
          role="tablist"
        >
          {tabs.map((tab, index) => {
            const isActive = index === activeTab;
            const Icon = getIcon(tab.icon);

            const baseClasses =
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer outline-hidden";

            const variantClasses = {
              underline: isActive
                ? "text-foreground border-b-2 border-violet-500 -mb-px"
                : "text-muted-foreground hover:text-foreground -mb-px border-b-2 border-transparent",
              pills: isActive
                ? "text-foreground bg-background rounded-md shadow-sm"
                : "text-muted-foreground hover:text-foreground rounded-md",
              bordered: isActive
                ? "text-foreground bg-background border-b-2 border-violet-500 -mb-px"
                : "text-muted-foreground hover:text-foreground -mb-px border-b-2 border-transparent",
            };

            return (
              <button
                key={index}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActiveTab(index)}
                className={`${baseClasses} ${variantClasses[variant]}`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div
          role="tabpanel"
          className={variant === "bordered" ? "p-6" : "pt-4"}
        >
          <div
            className="prose prose-sm dark:prose-invert max-w-none
              prose-p:my-2 prose-p:leading-relaxed
              prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg
              prose-code:text-xs
              prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
              prose-ul:my-2 prose-li:my-0
            "
            dangerouslySetInnerHTML={{ __html: activeContent }}
          />
        </div>
      </div>
    </Container>
  );
}
