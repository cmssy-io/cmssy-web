import { unstable_cache } from "next/cache";
import type { BlockPropsSchema } from "@cmssy/types";
import { blocks } from "@/cmssy/blocks";
import { harvestBlockText, joinPageText } from "@/lib/docs-search-text";
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

const SCHEMA_BY_TYPE = new Map<string, BlockPropsSchema>(
  blocks.map((block) => [
    block.type,
    (block as { props?: BlockPropsSchema }).props ?? {},
  ]),
);

async function docsPages(): Promise<ChildPage[]> {
  const sections = await listChildPages(DOCS_ROOT);
  const nested = await Promise.all(
    sections.map((section) => listChildPages(section.fullSlug)),
  );
  const all = [...sections, ...nested.flat()];
  const seen = new Set<string>();
  return all.filter((page) => {
    if (seen.has(page.id)) return false;
    seen.add(page.id);
    return true;
  });
}

export async function mapWithLimit<T, R>(
  input: T[],
  limit: number,
  run: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(input.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, input.length) },
    async () => {
      while (cursor < input.length) {
        const index = cursor;
        cursor += 1;
        const item = input[index];
        if (item === undefined) continue;
        results[index] = await run(item);
      }
    },
  );
  await Promise.all(workers);
  return results;
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
