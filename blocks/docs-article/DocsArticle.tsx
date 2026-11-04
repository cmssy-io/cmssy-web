import { Calendar } from "lucide-react";
import type { BlockProps } from "@cmssy/react";
import { Container } from "../../components/container";
import { extractTocItems } from "@/lib/toc";
import { formatDate } from "@/lib/utils";
import type { docsArticleProps, DocsArticleData } from "./block";
import { TocSidebar } from "./TocSidebar";

export default function DocsArticle({
  content,
  context,
  data,
}: BlockProps<typeof docsArticleProps, DocsArticleData>) {
  const lang = context?.locale.current;
  // A field on the page, handed over by the route (context.app), not content
  // an editor retypes inside this block.
  const lastUpdated =
    typeof context?.app?.lastUpdated === "string"
      ? context.app.lastUpdated
      : "";
  const {
    title,
    description,
    content: articleContent = "",
    showToc = true,
    tocTitle,
  } = content;

  const rendered = data?.html
    ? { html: data.html, items: data.toc ?? [] }
    : showToc
      ? extractTocItems(articleContent)
      : { html: articleContent, items: [] };

  return (
    <Container className="py-6 flex gap-8 lg:py-12">
      {/* Main Content */}
      <article className="min-w-0 max-w-3xl flex-1">
        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-4 font-heading text-h2 font-semibold">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground mb-4">{description}</p>
          )}
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              {/* The date is localized; a label in front of it would not be. */}
              <span>{formatDate(lastUpdated, lang)}</span>
            </div>
          )}
        </header>

        {/* Content */}
        <div
          className="prose max-w-none
            prose-headings:scroll-mt-[calc(var(--site-chrome,4rem)+var(--docs-tabs,0px)+1rem)]
            prose-headings:font-heading
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-li:marker:text-primary
          "
          dangerouslySetInnerHTML={{ __html: rendered.html }}
        />
      </article>

      {/* Table of Contents — client component for scroll tracking */}
      {showToc && rendered.items.length > 0 && (
        <TocSidebar items={rendered.items} title={tocTitle} />
      )}
    </Container>
  );
}
