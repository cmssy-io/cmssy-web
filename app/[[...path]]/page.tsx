import { draftMode } from "next/headers";
import { createCmssyPage, resolveCmssyLayout } from "@cmssy/next/server";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
import { listChildPages, publishedPaths } from "@/services/pages";
import { buildPageMetadata } from "@/services/seo";
import { DocsShell } from "@/components/docs-shell";
import { DocsPrevNext } from "@/components/docs-prev-next";
import { DocsBreadcrumbs } from "@/components/docs-breadcrumbs";
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
    <DocsShell>
      <div className="mx-auto flex w-full max-w-320 flex-col md:flex-row">
        <aside className="sticky top-[var(--site-chrome,4rem)] z-30 md:h-[calc(100dvh-var(--site-chrome,4rem))] md:w-64 md:shrink-0 md:overflow-y-auto md:overscroll-contain md:border-r md:border-border">
          {sidebar.element}
        </aside>
        <main className="min-w-0 flex-1">
          {trail ? <DocsBreadcrumbs trail={trail} /> : null}
          {content}
          {section && around ? (
            <DocsPrevNext
              prev={around.prev}
              next={around.next}
              ui={section.ui}
            />
          ) : null}
        </main>
      </div>
    </DocsShell>
  );
}
