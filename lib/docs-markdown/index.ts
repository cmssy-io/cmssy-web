// Docs pages as Markdown, for AI agents and for "Copy page". Built from the
// published blocks on every read, so there is no second copy of the docs.

import { blockToMarkdown } from "./blocks";

export { htmlToMarkdown, isDocsPath, markdownHref } from "./html";

export type MarkdownBlock = { type: string; content?: unknown };

export type MarkdownPage = {
  title: string;
  description?: string;
  url: string;
  lastUpdated?: string;
  blocks: MarkdownBlock[];
};

export type MarkdownOptions = {
  /** Public origin; site-relative links become absolute against it. */
  base: string;
  locale: string;
  fallbackLocale: string;
  /** Plain text for a block with no Markdown shape of its own. */
  fallback?: (type: string, content: unknown) => string;
};

export function pageToMarkdown(page: MarkdownPage, options: MarkdownOptions): string {
  const { base, locale, fallbackLocale, fallback } = options;
  const front = [
    "---",
    `title: ${JSON.stringify(page.title)}`,
    ...(page.description ? [`description: ${JSON.stringify(page.description)}`] : []),
    `url: ${page.url}`,
    ...(page.lastUpdated ? [`last_updated: ${page.lastUpdated}`] : []),
    "---",
  ].join("\n");

  const body = page.blocks
    .map(({ type, content }) => {
      const buckets = (content ?? {}) as Record<string, Record<string, unknown>>;
      const localized = buckets[locale] ?? buckets[fallbackLocale] ?? {};
      return blockToMarkdown(type, localized, base, fallback).trim();
    })
    .filter(Boolean)
    .join("\n\n");

  return `${front}\n\n# ${page.title}\n\n${body}\n`;
}

/** Route params to a slug; a rewrite may hand the whole path over as one segment. */
export function docsSlugFromParams(path: string[] | undefined): string | null {
  try {
    const segments = (path ?? [])
      .flatMap((segment) => decodeURIComponent(segment).split("/"))
      .filter(Boolean);
    return ["/docs", ...segments].join("/");
  } catch {
    return null;
  }
}
