import { Calendar, ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";
import { TocSidebar } from "./TocSidebar";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract headings from HTML string and inject unique IDs into the HTML.
 * Works in both Node.js (SSR) and browser — no DOMParser needed.
 *
 * Returns the rewritten HTML alongside the TOC items so anchor links
 * (`#${item.id}`) match the heading IDs even when multiple headings
 * share the same text (e.g. "Pros" / "Cons" repeated per section).
 */
function extractTocItems(html: string): {
  html: string;
  items: TocItem[];
} {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();
  const regex = /<(h[23])((?:\s[^>]*)?)>(.*?)<\/\1>/gi;
  const idAttrRegex = /\sid="([^"]*)"/i;

  const rewritten = html.replace(regex, (full, tag, attrs, inner) => {
    const explicitMatch = attrs.match(idAttrRegex);
    const explicitId = explicitMatch ? explicitMatch[1] : "";
    const text = inner.replace(/<[^>]*>/g, "").trim();
    if (!text) return full;

    const baseId = explicitId || text.toLowerCase().replace(/\s+/g, "-");
    const count = (seen.get(baseId) ?? 0) + 1;
    seen.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;

    items.push({ id, text, level: tag.toLowerCase() === "h2" ? 2 : 3 });

    if (explicitMatch && id === explicitId) return full;
    const newAttrs = explicitMatch
      ? attrs.replace(idAttrRegex, ` id="${id}"`)
      : `${attrs} id="${id}"`;
    return `<${tag}${newAttrs}>${inner}</${tag}>`;
  });

  return { html: rewritten, items };
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function DocsArticle({ content }: { content: BlockContent }) {
  const {
    breadcrumbs = [],
    title,
    description,
    lastUpdated,
    content: articleContent = "",
    showToc = true,
    tocTitle = "On this page",
    showPrevNext = true,
    prevPage = [],
    nextPage = [],
    showEditLink = true,
    editUrl,
  } = content;

  const toc = showToc
    ? extractTocItems(articleContent)
    : { html: articleContent, items: [] };
  const prev = prevPage[0];
  const next = nextPage[0];

  return (
    <Container className="py-6 flex gap-8 lg:py-12">
      {/* Main Content */}
      <article className="flex-1 min-w-0">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-6"
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span key={index} className="flex items-center gap-1.5">
                  {crumb.url && !isLast ? (
                    <a
                      href={crumb.url}
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span
                      className={isLast ? "text-violet-600 font-medium" : ""}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {crumb.label}
                    </span>
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
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground mb-4">{description}</p>
          )}
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>Last updated: {formatDate(lastUpdated)}</span>
            </div>
          )}
        </header>

        {/* Content */}
        <div
          className="prose prose-violet dark:prose-invert max-w-none
            prose-headings:scroll-mt-20
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
            prose-ul:text-muted-foreground prose-li:marker:text-violet-500
          "
          dangerouslySetInnerHTML={{ __html: toc.html }}
        />

        {/* Edit Link */}
        {showEditLink && editUrl && (
          <div className="mt-12 pt-6 border-t">
            <a
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <PenLine className="size-4" />
              Edit this page on GitHub
            </a>
          </div>
        )}

        {/* Prev/Next Navigation */}
        {showPrevNext && (prev || next) && (
          <nav className="mt-8 pt-8 border-t grid grid-cols-2 gap-4">
            {prev ? (
              <a
                href={prev.url}
                className="group flex flex-col p-4 rounded-lg border hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors"
              >
                <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <ChevronLeft className="size-3" />
                  Previous
                </span>
                <span className="font-medium group-hover:text-violet-600 transition-colors">
                  {prev.label}
                </span>
              </a>
            ) : (
              <div />
            )}
            {next && (
              <a
                href={next.url}
                className="group flex flex-col items-end p-4 rounded-lg border hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors"
              >
                <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  Next
                  <ChevronRight className="size-3" />
                </span>
                <span className="font-medium group-hover:text-violet-600 transition-colors">
                  {next.label}
                </span>
              </a>
            )}
          </nav>
        )}
      </article>

      {/* Table of Contents — client component for scroll tracking */}
      {showToc && toc.items.length > 0 && (
        <TocSidebar items={toc.items} title={tocTitle} />
      )}
    </Container>
  );
}
