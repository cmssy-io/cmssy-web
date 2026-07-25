import { Calendar, PenLine } from "lucide-react";
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
  const {
    title,
    description,
    lastUpdated,
    content: articleContent = "",
    showToc = true,
    tocTitle,
    showEditLink = true,
    editUrl,
  } = content;

  const rendered = data?.html
    ? { html: data.html, items: data.toc ?? [] }
    : showToc
      ? extractTocItems(articleContent)
      : { html: articleContent, items: [] };

  return (
    <Container className="py-6 flex gap-8 lg:py-12">
      {/* Main Content */}
      <article className="flex-1 min-w-0">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground mb-4">{description}</p>
          )}
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>Last updated: {formatDate(lastUpdated, lang)}</span>
            </div>
          )}
        </header>

        {/* Content */}
        <div
          className="prose max-w-none
            prose-headings:scroll-mt-20
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-ul:text-muted-foreground prose-li:marker:text-primary
          "
          dangerouslySetInnerHTML={{ __html: rendered.html }}
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
      </article>

      {/* Table of Contents — client component for scroll tracking */}
      {showToc && rendered.items.length > 0 && (
        <TocSidebar items={rendered.items} title={tocTitle} />
      )}
    </Container>
  );
}
