import type { DocsSearchItem } from "@/components/docs-search";
import {
  areaForSlug,
  buildDocsNav,
  labelForPage,
  pickLocalizedValue,
  type DocsArea,
  type DocsNavSection,
  type DocsPageNode,
} from "@/lib/docs-nav";
import { docsUiFrom, type DocsUi } from "@/lib/docs-ui";
import { listChildPages } from "@/services/pages";

export type DocsSection = {
  root: { slug: string; label: string };
  areas: DocsArea[];
  area: DocsArea | null;
  nav: DocsNavSection[];
  searchItems: DocsSearchItem[];
  ui: DocsUi;
};

export async function loadDocsSection(
  segments: string[],
  locale: string,
  defaultLocale: string,
): Promise<DocsSection | null> {
  const rootSlug = segments[0] ? `/${segments[0]}` : null;
  if (!rootSlug) return null;

  const [topLevel, areaPages] = await Promise.all([
    listChildPages("/"),
    listChildPages(rootSlug),
  ]);
  const rootPage = topLevel.find((page) => page.fullSlug === rootSlug);
  if (!rootPage) return null;

  const label = (page: DocsPageNode) =>
    labelForPage(page, locale, defaultLocale);

  const areasWithPages = await Promise.all(
    areaPages.map(async (page) => {
      const children = await listChildPages(page.fullSlug);
      const nested = await Promise.all(
        children.map(async (child) => ({
          page: child,
          children: await listChildPages(child.fullSlug),
        })),
      );
      return { page, nested };
    }),
  );

  const flatten = (nested: { page: DocsPageNode; children: DocsPageNode[] }[]) =>
    nested.flatMap(({ page, children }) => [page, ...children]);

  const areas: DocsArea[] = areasWithPages.map(({ page, nested }) => ({
    slug: page.fullSlug,
    label: label(page),
    description: pickLocalizedValue(page.seoDescription, locale, defaultLocale),
    pageCount: flatten(nested).length,
  }));

  const currentSlug = `/${segments.join("/")}`;
  const area = areaForSlug(currentSlug, areas);
  const active = area
    ? areasWithPages.find(({ page }) => page.fullSlug === area.slug)
    : undefined;

  const nav = active
    ? buildDocsNav(
        [{ page: active.page, children: [] }, ...active.nested],
        locale,
        defaultLocale,
      )
    : [];

  const searchItems = areasWithPages.flatMap(({ page, nested }) =>
    [page, ...flatten(nested)].map((entry) => ({
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
    root: { slug: rootPage.fullSlug, label: label(rootPage) },
    areas,
    area,
    nav,
    searchItems,
    ui: docsUiFrom(rootPage.customFields, locale, defaultLocale),
  };
}
