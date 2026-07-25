import { ChevronLeft, ChevronRight } from "lucide-react";
import { CmssyLink } from "./cmssy-locale";
import { Container } from "./container";
import type { DocsNavPage } from "@/lib/docs-nav";

// Reading-order navigation, derived from the same nav as the sidebar
// (see lib/docs-nav.ts). Route-level rather than part of the article block, so
// it cannot drift from the sidebar and every docs page gets it - section hubs
// included.
export function DocsPrevNext({
  prev,
  next,
}: {
  prev: DocsNavPage | null;
  next: DocsNavPage | null;
}) {
  if (!prev && !next) return null;

  return (
    <Container className="pb-12">
      <nav
        aria-label="Documentation pages"
        className="grid grid-cols-2 gap-4 border-t pt-8"
      >
        {prev ? (
          <CmssyLink
            href={prev.slug}
            className="group flex flex-col rounded-lg border p-4 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ChevronLeft className="size-3" />
              Previous
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
              Next
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
