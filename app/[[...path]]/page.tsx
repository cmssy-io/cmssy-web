import { createCmssyPage } from "@cmssy/next/server";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { splitLocaleFromPath } from "@/lib/locale-path";
import { listChildPages, type ChildPage } from "@/services/pages";
import { buildPageMetadata } from "@/services/seo";
import { resolveSiteLocales } from "@/services/site";
import { DocsShell } from "@/components/docs-shell";
import { DocsSidebarNav } from "@/components/docs-sidebar-nav";
import { DocsPrevNext } from "@/components/docs-prev-next";
import { DocsBreadcrumbs } from "@/components/docs-breadcrumbs";
import {
  buildDocsNav,
  docsBreadcrumbs,
  docsPrevNext,
  labelForPage,
  pickLocalizedValue,
  type DocsNavSection,
} from "@/lib/docs-nav";
import { docsUiFrom } from "@/lib/docs-ui";
import type { DocsSearchItem } from "@/components/docs-search";

export const revalidate = 3600;
export const dynamicParams = true;

const renderPage = createCmssyPage(cmssy, blocks);

type PageProps = {
  params: Promise<{ path?: string[] }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  return buildPageMetadata(path);
}

/**
 * A top-level section gets the reading shell - sidebar plus prev/next - when
 * the CMS says it is a tree of pages rather than a feed of posts. No slug is
 * named here: the section is whatever the current URL's first segment is, and
 * whether it qualifies comes from the page types the CMS returns.
 */
function isPageTree(children: ChildPage[]): boolean {
  return (
    children.length > 0 && children.every((child) => child.pageType !== "post")
  );
}

async function buildSection(
  sectionPages: ChildPage[],
  locale: string,
  defaultLocale: string,
): Promise<{ nav: DocsNavSection[]; searchItems: DocsSearchItem[] }> {
  const withChildren = await Promise.all(
    sectionPages.map(async (page) => ({
      page,
      children: await listChildPages(page.fullSlug),
    })),
  );

  // The search index is the same tree the sidebar shows: nothing to reindex,
  // and a page published today is searchable today.
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
    nav: buildDocsNav(withChildren, locale, defaultLocale),
    searchItems,
  };
}

export default async function Page({ params }: PageProps) {
  const { path } = await params;
  const locales = await resolveSiteLocales();
  const { locale, path: strippedPath } = splitLocaleFromPath(path, locales);
  const segments = strippedPath ?? [];
  const slug = "/" + segments.join("/");
  const sectionRoot = segments[0] ? `/${segments[0]}` : null;

  const [content, topLevel, sectionPages] = await Promise.all([
    renderPage({ params: Promise.resolve({ path }) }),
    sectionRoot ? listChildPages("/") : Promise.resolve<ChildPage[]>([]),
    sectionRoot
      ? listChildPages(sectionRoot)
      : Promise.resolve<ChildPage[]>([]),
  ]);

  // The section's own page carries the label the sidebar heads with.
  const rootPage = topLevel.find((page) => page.fullSlug === sectionRoot);
  if (!rootPage || !isPageTree(sectionPages)) return content;

  const { nav, searchItems } = await buildSection(
    sectionPages,
    locale,
    locales.defaultLocale,
  );
  const root = {
    slug: rootPage.fullSlug,
    label: labelForPage(rootPage, locale, locales.defaultLocale),
  };
  // The shell's own words - "Previous", the search placeholder - are authored
  // on the section root alongside its name.
  const ui = docsUiFrom(rootPage.customFields, locale, locales.defaultLocale);
  const { prev, next } = docsPrevNext(slug, nav);

  return (
    <DocsShell>
      <div className="flex flex-col md:flex-row">
        <aside className="sticky top-0 z-30 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-border">
          <DocsSidebarNav
            root={root}
            sections={nav}
            searchItems={searchItems}
            ui={ui}
          />
        </aside>
        <main className="min-w-0 flex-1">
          <DocsBreadcrumbs trail={docsBreadcrumbs(slug, nav, root)} />
          {content}
          <DocsPrevNext prev={prev} next={next} ui={ui} />
        </main>
      </div>
    </DocsShell>
  );
}
