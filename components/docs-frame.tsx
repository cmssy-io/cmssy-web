import { DocsAreaTabs } from "./docs-area-tabs";
import { DocsShell } from "./docs-shell";
import type { DocsSection } from "@/lib/docs-section";

export function DocsFrame({
  section,
  sidebar,
  showSidebar = Boolean(section?.area),
  children,
}: {
  section: DocsSection | null;
  sidebar: React.ReactNode;
  showSidebar?: boolean;
  children: React.ReactNode;
}) {
  return (
    <DocsShell>
      <div
        className={
          section
            ? "[--docs-area-tabs:3rem] max-md:has-[[data-hidden]]:[--docs-area-tabs:0px]"
            : undefined
        }
      >
        {section ? (
          <DocsAreaTabs
            root={section.root}
            areas={section.areas}
            searchItems={section.searchItems}
            ui={section.ui}
          />
        ) : null}
        <div className="mx-auto flex w-full max-w-320 flex-col md:flex-row">
          {showSidebar ? (
            <aside className="sticky top-[calc(var(--site-chrome,4rem)+var(--docs-area-tabs,0px))] z-30 md:h-[calc(100dvh-var(--site-chrome,4rem)-var(--docs-area-tabs,0px))] md:w-64 md:shrink-0 md:overflow-y-auto md:overscroll-contain md:border-r md:border-border">
              {sidebar}
            </aside>
          ) : null}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </DocsShell>
  );
}
