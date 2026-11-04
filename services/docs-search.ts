import { unstable_cache } from "next/cache";
import type { BlockPropsSchema } from "@cmssy/types";
import { blocks } from "@/cmssy/blocks";
import { harvestBlockText, joinPageText } from "@/lib/docs-search-text";
import { mapWithLimit } from "@/lib/map-with-limit";
import {
  CONTENT_TAG,
  getPageById,
  listChildPages,
  type ChildPage,
} from "@/services/pages";

export type DocsSearchBodyEntry = {
  slug: string;
  body: string;
};

const DOCS_ROOT = "/docs";
const CONCURRENCY = 6;
const MAX_DEPTH = 8;

const SCHEMA_BY_TYPE = new Map<string, BlockPropsSchema>(
  blocks.map((block) => [
    block.type,
    (block as { props?: BlockPropsSchema }).props ?? {},
  ]),
);

/** Every published page under /docs, depth-first in tree order. */
export async function docsPages(): Promise<ChildPage[]> {
  const seen = new Set<string>();
  const childrenOf = new Map<string, ChildPage[]>();
  let frontier = [DOCS_ROOT];
  for (let depth = 0; depth < MAX_DEPTH && frontier.length > 0; depth++) {
    const lists = await mapWithLimit(frontier, CONCURRENCY, (slug) =>
      listChildPages(slug),
    );
    const next: string[] = [];
    frontier.forEach((slug, index) => {
      const fresh = (lists[index] ?? []).filter((page) => {
        if (seen.has(page.id)) return false;
        seen.add(page.id);
        return true;
      });
      childrenOf.set(slug, fresh);
      next.push(...fresh.map((page) => page.fullSlug));
    });
    frontier = next;
  }
  const flatten = (slug: string, depth: number): ChildPage[] =>
    depth === MAX_DEPTH
      ? []
      : (childrenOf.get(slug) ?? []).flatMap((page) => [
          page,
          ...flatten(page.fullSlug, depth + 1),
        ]);
  return flatten(DOCS_ROOT, 0);
}

export { mapWithLimit };

/** A block's prose, for a block the Markdown serializer has no shape for. */
export function blockPlainText(type: string, content: unknown): string {
  return harvestBlockText(SCHEMA_BY_TYPE.get(type), content);
}

function bodyOfPage(
  pageBlocks: { type: string; content?: unknown }[],
  locale: string,
  fallbackLocale: string,
): string {
  const parts = pageBlocks.map((block) => {
    const buckets = block.content as Record<string, unknown> | undefined;
    const localized = buckets?.[locale] ?? buckets?.[fallbackLocale];
    return harvestBlockText(SCHEMA_BY_TYPE.get(block.type), localized);
  });
  return joinPageText(parts);
}

export async function buildDocsSearchBodies(
  locale: string,
  fallbackLocale: string,
): Promise<DocsSearchBodyEntry[]> {
  const pages = await docsPages();
  const entries = await mapWithLimit(pages, CONCURRENCY, async (page) => {
    const loaded = await getPageById(page.id);
    if (!loaded) return null;
    const body = bodyOfPage(
      loaded.blocks as { type: string; content?: unknown }[],
      locale,
      fallbackLocale,
    );
    return body ? { slug: page.fullSlug, body } : null;
  });
  return entries.filter(
    (entry): entry is DocsSearchBodyEntry => entry !== null,
  );
}

export function loadDocsSearchBodies(
  locale: string,
  fallbackLocale: string,
): Promise<DocsSearchBodyEntry[]> {
  return unstable_cache(
    () => buildDocsSearchBodies(locale, fallbackLocale),
    ["cmssy-docs-search-bodies", locale, fallbackLocale],
    { tags: [CONTENT_TAG], revalidate: 3600 },
  )();
}
