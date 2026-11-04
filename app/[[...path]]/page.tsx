import { draftMode } from "next/headers";
import { createCmssyPage, resolveCmssyLayout } from "@cmssy/next/server";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
import {
  CONTENT_CACHE,
  listChildPages,
  publishedPaths,
} from "@/services/pages";
import { buildPageMetadata } from "@/services/seo";
import { DocsPrevNext } from "@/components/docs-prev-next";
import { DocsBreadcrumbs } from "@/components/docs-breadcrumbs";
import { DocsFrame } from "@/components/docs-frame";
import { DocsPageActions } from "@/components/docs-page-actions";
import { isDocsPath } from "@/lib/docs-markdown";
import { docsBreadcrumbs, docsPrevNext } from "@/lib/docs-nav";
import { loadDocsSection } from "@/lib/docs-section";
import { customFieldText } from "@/lib/docs-ui";
import { regionHasBlocks } from "@/lib/layout-regions";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return publishedPaths();
}

async function appContextFor(slug: string): Promise<Record<string, unknown>> {
  const parent = slug.slice(0, slug.lastIndexOf("/")) || "/";
  const siblings = await listChildPages(parent);
  const page = siblings.find((entry) => entry.fullSlug === slug);
  const lastUpdated = customFieldText(page?.customFields, "lastUpdated");
  return lastUpdated ? { lastUpdated } : {};
}

const renderPage = createCmssyPage(cmssy, blocks, {
  appContext: ({ page }) => appContextFor(page.slug ?? "/"),
  cache: CONTENT_CACHE,
});

type PageProps = {
  params: Promise<{ path?: string[] }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  return buildPageMetadata(path);
}

export default async function Page({ params }: PageProps) {
  const { path } = await params;
  const { isEnabled: draft } = await draftMode();

  const [content, sidebar] = await Promise.all([
    renderPage({ params: Promise.resolve({ path }) }),
    resolveCmssyLayout(cmssy, {
      region: "sidebar_left",
      blocks,
      path: path ?? [],
      editMode: false,
      preview: draft,
      editable: EditableLayout,
      cache: CONTENT_CACHE,
    }),
  ]);

  if (!regionHasBlocks(sidebar.groups, "sidebar_left")) return content;

  const section = await loadDocsSection(
    sidebar.page.path,
    sidebar.locale,
    sidebar.defaultLocale,
  );
  const trail = section
    ? docsBreadcrumbs(sidebar.page.slug, section.nav, section.root)
    : null;
  const around = section ? docsPrevNext(sidebar.page.slug, section.nav) : null;

  return (
    <DocsFrame section={section} sidebar={sidebar.element}>
      {trail ? (
        <DocsBreadcrumbs trail={trail}>
          {section &&
          isDocsPath(sidebar.page.slug) &&
          sidebar.locale === sidebar.defaultLocale ? (
            <DocsPageActions slug={sidebar.page.slug} ui={section.ui} />
          ) : null}
        </DocsBreadcrumbs>
      ) : null}
      {content}
      {section && around ? (
        <DocsPrevNext prev={around.prev} next={around.next} ui={section.ui} />
      ) : null}
    </DocsFrame>
  );
}
