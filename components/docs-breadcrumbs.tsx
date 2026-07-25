import { ChevronRight } from "lucide-react";
import { CmssyLink } from "./cmssy-locale";
import { Container } from "./container";

// The trail comes from the page's position in the CMS tree (see lib/docs-nav.ts)
// and is rendered route-level, like prev/next: move a page in the admin and the
// crumbs follow, with nothing to re-enter on the article block.
export function DocsBreadcrumbs({
  trail,
}: {
  trail: { slug: string; label: string }[];
}) {
  // A section hub is its own root - one crumb pointing at itself says nothing.
  if (trail.length < 2) return null;

  return (
    <Container className="pt-6 lg:pt-12">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
      >
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <span key={crumb.slug} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="font-medium text-primary" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <CmssyLink
                  href={crumb.slug}
                  className="transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </CmssyLink>
              )}
              {!isLast && (
                <ChevronRight
                  className="size-3 shrink-0 text-muted-foreground/60"
                  aria-hidden="true"
                />
              )}
            </span>
          );
        })}
      </nav>
    </Container>
  );
}
