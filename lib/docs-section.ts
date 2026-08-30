import type { DocsSearchItem } from "@/components/docs-search";
import {
  buildDocsNav,
  labelForPage,
  pickLocalizedValue,
  type DocsNavSection,
} from "@/lib/docs-nav";
import { docsUiFrom, type DocsUi } from "@/lib/docs-ui";
import { listChildPages } from "@/services/pages";

export type DocsSection = {
  root: { slug: string; label: string };
  nav: DocsNavSection[];
  searchItems: DocsSearchItem[];
  ui: DocsUi;
};

export async function loadDocsSection(
  segments: string[],
  locale: string,
  defaultLocale: string,
): Promise<DocsSection | null> {
  const sectionRoot = segments[0] ? `/${segments[0]}` : null;
  if (!sectionRoot) return null;

  const [topLevel, sectionPages] = await Promise.all([
    listChildPages("/"),
    listChildPages(sectionRoot),
  ]);
  const rootPage = topLevel.find((page) => page.fullSlug === sectionRoot);
  if (!rootPage) return null;

  const withChildren = await Promise.all(
    sectionPages.map(async (page) => ({
      page,
      children: await listChildPages(page.fullSlug),
    })),
  );

  const searchItems = withChildren.flatMap(({ page, children }) =>
    [page, ...children].map((entry) => ({
      slug: entry.fullSlug,
      label: labelForPage(entry, locale, defaultLocale),
      section: labelForPage(page, locale, defaultLocale),
      description: pickLocalizedValue(
        entry.seoDescription,
        locale,
        defaultLocale,
      ),
    })),
  );

  return {
    root: {
      slug: rootPage.fullSlug,
      label: labelForPage(rootPage, locale, defaultLocale),
    },
    nav: buildDocsNav(withChildren, locale, defaultLocale),
    searchItems,
    ui: docsUiFrom(rootPage.customFields, locale, defaultLocale),
  };
}
