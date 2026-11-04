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
  rootSlug: string,
  rootId: string,
): Promise<DocsTreeNode[]> {
  const seen = new Set([rootId]);
  const roots: DocsTreeNode[] = [];
  let frontier = [{ slug: rootSlug, into: roots }];
  for (let depth = 0; depth < MAX_DEPTH && frontier.length; depth += 1) {
    const next: typeof frontier = [];
    const pages = await mapWithLimit(frontier, CONCURRENCY, ({ slug }) =>
      listChildPages(slug),
    );
    frontier.forEach(({ into }, index) => {
      for (const page of pages[index] ?? []) {
        if (seen.has(page.id)) continue;
        seen.add(page.id);
        const node: DocsTreeNode = { page, children: [] };
        into.push(node);
        next.push({ slug: page.fullSlug, into: node.children });
      }
    });
    frontier = next;
  }
  return roots;
}

export function flattenTree(
  nodes: DocsTreeNode[],
  depth = 1,
): { page: ChildPage; depth: number }[] {
  return nodes.flatMap(({ page, children }) => [
    { page, depth },
    ...flattenTree(children, depth + 1),
  ]);
}

export async function buildDocsTree(
  rootSlug: string,
): Promise<{ root: ChildPage; areas: DocsTreeNode[] } | null> {
  const topLevel = await listChildPages("/");
  const root = topLevel.find((page) => page.fullSlug === rootSlug);
  if (!root) return null;
  return { root, areas: await walkTree(rootSlug, root.id) };
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
    [page, ...flattenTree(children).map((entry) => entry.page)].map((entry) => ({
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
