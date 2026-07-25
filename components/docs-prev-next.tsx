import { ChevronLeft, ChevronRight } from "lucide-react";
import { CmssyLink } from "./cmssy-locale";
import { Container } from "./container";
import type { DocsNavPage } from "@/lib/docs-nav";
import type { DocsUi } from "@/lib/docs-ui";

// Reading-order navigation, derived from the same nav as the sidebar
// (see lib/docs-nav.ts). Route-level rather than part of the article block, so
// it cannot drift from the sidebar and every docs page gets it - section hubs
// included. The captions come from the CMS; without them the cards still read,
// because the arrow and the page title carry the meaning.
export function DocsPrevNext({
  prev,
  next,
  ui,
}: {
  prev: DocsNavPage | null;
  next: DocsNavPage | null;
  ui: DocsUi;
}) {
  if (!prev && !next) return null;

  return (
    <Container className="pb-12">
      <nav
        aria-label={ui.navLabel}
        className="grid grid-cols-2 gap-4 border-t pt-8"
      >
        {prev ? (
          <CmssyLink
            href={prev.slug}
            className="group flex flex-col rounded-lg border p-4 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ChevronLeft className="size-3" />
              {ui.previous}
            </span>
            <span className="font-medium transition-colors group-hover:text-primary">
              {prev.label}
            </span>
          </CmssyLink>
        ) : (
          <div />
        )}
        {next && (
          <CmssyLink
            href={next.slug}
            className="group flex flex-col items-end rounded-lg border p-4 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              {ui.next}
              <ChevronRight className="size-3" />
            </span>
            <span className="font-medium transition-colors group-hover:text-primary">
              {next.label}
            </span>
          </CmssyLink>
        )}
      </nav>
    </Container>
  );
}
