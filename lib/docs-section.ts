import { unstable_cache } from "next/cache";
import type { DocsSearchItem } from "@/components/docs-search";
import {
  areaForSlug,
  buildDocsNav,
  labelForPage,
  pickLocalizedValue,
  type DocsArea,
  type DocsNavSection,
} from "@/lib/docs-nav";
import { docsUiFrom, type DocsUi } from "@/lib/docs-ui";
import { mapWithLimit } from "@/lib/map-with-limit";
import { CONTENT_TAG, listChildPages, type ChildPage } from "@/services/pages";

export type DocsSection = {
  root: { slug: string; label: string };
  areas: DocsArea[];
  area: DocsArea | null;
  nav: DocsNavSection[];
  searchItems: DocsSearchItem[];
  ui: DocsUi;
};

export type DocsTreeNode = { page: ChildPage; children: DocsTreeNode[] };

const CONCURRENCY = 4;
const MAX_DEPTH = 8;

async function walkTree(
  parentSlug: string,
  depth: number,
  seen: Set<string>,
): Promise<DocsTreeNode[]> {
  if (depth === MAX_DEPTH) return [];
  const children = (await listChildPages(parentSlug)).filter((page) => {
    if (seen.has(page.id)) return false;
    seen.add(page.id);
    return true;
  });
  return mapWithLimit(children, CONCURRENCY, async (page) => ({
    page,
    children: await walkTree(page.fullSlug, depth + 1, seen),
  }));
}

export function flattenTree(nodes: DocsTreeNode[]): ChildPage[] {
  return nodes.flatMap(({ page, children }) => [page, ...flattenTree(children)]);
}

export async function buildDocsTree(
  rootSlug: string,
): Promise<{ root: ChildPage; areas: DocsTreeNode[] } | null> {
  const topLevel = await listChildPages("/");
  const root = topLevel.find((page) => page.fullSlug === rootSlug);
  if (!root) return null;
  return { root, areas: await walkTree(rootSlug, 0, new Set([root.id])) };
}

function loadDocsTree(rootSlug: string) {
  return unstable_cache(() => buildDocsTree(rootSlug), ["cmssy-docs-tree", rootSlug], {
    tags: [CONTENT_TAG],
    revalidate: 3600,
  })();
}

export async function loadDocsSection(
  segments: string[],
  locale: string,
  defaultLocale: string,
): Promise<DocsSection | null> {
  const rootSlug = segments[0] ? `/${segments[0]}` : null;
  if (!rootSlug) return null;

  const tree = await loadDocsTree(rootSlug);
  if (!tree) return null;

  const label = (page: ChildPage) => labelForPage(page, locale, defaultLocale);

  const areas: DocsArea[] = tree.areas.map(({ page, children }) => ({
    slug: page.fullSlug,
    label: label(page),
    description: pickLocalizedValue(page.seoDescription, locale, defaultLocale),
    pageCount: flattenTree(children).length,
  }));

  const currentSlug = `/${segments.join("/")}`;
  const area = areaForSlug(currentSlug, areas);
  const active = area
    ? tree.areas.find(({ page }) => page.fullSlug === area.slug)
    : undefined;

  const nav = active
    ? buildDocsNav(
        [
          { page: active.page, children: [] },
          ...active.children.map(({ page, children }) => ({
            page,
            children: flattenTree(children),
          })),
        ],
        locale,
        defaultLocale,
      )
    : [];

  const searchItems = tree.areas.flatMap(({ page, children }) =>
    [page, ...flattenTree(children)].map((entry) => ({
      slug: entry.fullSlug,
      label: label(entry),
      section: label(page),
      description: pickLocalizedValue(
        entry.seoDescription,
        locale,
        defaultLocale,
      ),
    })),
  );

  return {
    root: { slug: tree.root.fullSlug, label: label(tree.root) },
    areas,
    area,
    nav,
    searchItems,
    ui: docsUiFrom(tree.root.customFields, locale, defaultLocale),
  };
}
