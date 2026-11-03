import { unstable_cache } from "next/cache";
import { pageToMarkdown, type MarkdownBlock } from "@/lib/docs-markdown";
import { pickLocalizedValue } from "@/lib/docs-nav";
import { customFieldText } from "@/lib/docs-ui";
import { localizedPath } from "@/lib/locale-path";
import { siteUrl } from "@/lib/site-url";
import {
  blockPlainText,
  docsPages,
  mapWithLimit,
} from "@/services/docs-search";
import {
  CONTENT_TAG,
  getPageById,
  getPageId,
  listChildPages,
  type ChildPage,
} from "@/services/pages";
import { resolveSiteLocales } from "@/services/site";

const CONCURRENCY = 6;

async function render(page: ChildPage): Promise<string | null> {
  const loaded = await getPageById(page.id);
  if (!loaded) return null;
  const { defaultLocale } = await resolveSiteLocales();
  const base = siteUrl();
  return pageToMarkdown(
    {
      title:
        pickLocalizedValue(page.displayName, defaultLocale, defaultLocale) ||
        page.fullSlug,
      description: pickLocalizedValue(
        page.seoDescription,
        defaultLocale,
        defaultLocale,
      ),
      url: `${base}${localizedPath(page.fullSlug, defaultLocale, defaultLocale)}`,
      lastUpdated: customFieldText(page.customFields, "lastUpdated"),
      blocks: loaded.blocks as MarkdownBlock[],
    },
    {
      base,
      locale: defaultLocale,
      fallbackLocale: defaultLocale,
      fallback: blockPlainText,
    },
  );
}

async function findPage(slug: string): Promise<ChildPage | null> {
  const parent = slug.slice(0, slug.lastIndexOf("/")) || "/";
  const siblings = await listChildPages(parent);
  const found = siblings.find((page) => page.fullSlug === slug);
  if (found) return found;
  // The page tree lists children only; an unknown slug stops here.
  const id = await getPageId(slug);
  return id ? { id: id.id, fullSlug: slug } : null;
}

/** One published docs page as Markdown, or null when there is none. */
export function loadDocsMarkdown(slug: string): Promise<string | null> {
  return unstable_cache(
    async () => {
      const page = await findPage(slug);
      return page ? render(page) : null;
    },
    ["cmssy-docs-markdown", slug],
    { tags: [CONTENT_TAG], revalidate: 3600 },
  )();
}

/** Every docs page in tree order, for llms-full.txt. */
export function loadAllDocsMarkdown(): Promise<string> {
  return unstable_cache(
    async () => {
      // docsPages walks the children of /docs, not /docs itself.
      const root = await findPage("/docs");
      const pages = [...(root ? [root] : []), ...(await docsPages())];
      const documents = await mapWithLimit(pages, CONCURRENCY, render);
      return documents.filter(Boolean).join("\n");
    },
    ["cmssy-docs-markdown-all"],
    { tags: [CONTENT_TAG], revalidate: 3600 },
  )();
}
