import { draftMode } from "next/headers";
import { createCmssyPage } from "@cmssy/next/server";
import { CmssyServerLayout } from "@cmssy/react";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { splitLocaleFromPath } from "@/lib/locale-path";
import { listChildPages, publishedPaths } from "@/services/pages";
import { fetchChromeLayouts } from "@/services/layout";
import { buildPageMetadata } from "@/services/seo";
import { resolveSiteLocales } from "@/services/site";
import { DocsShell } from "@/components/docs-shell";
import { DocsPrevNext } from "@/components/docs-prev-next";
import { DocsBreadcrumbs } from "@/components/docs-breadcrumbs";
import { docsBreadcrumbs, docsPrevNext } from "@/lib/docs-nav";
import { loadDocsSection } from "@/lib/docs-section";
import { customFieldText } from "@/lib/docs-ui";

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
  const locales = await resolveSiteLocales();
  const { locale, path: strippedPath } = splitLocaleFromPath(path, locales);
  const segments = strippedPath ?? [];
  const slug = "/" + segments.join("/");

  const [content, groups] = await Promise.all([
    renderPage({ params: Promise.resolve({ path }) }),
    fetchChromeLayouts(slug, draft ? cmssy.draftSecret : undefined),
  ]);

  const sidebar = groups.find((group) => group.position === "sidebar_left");
  if (!sidebar?.blocks.some((block) => block.isActive)) return content;

  const section = await loadDocsSection(
    segments,
    locale,
    locales.defaultLocale,
  );
  const trail = section
    ? docsBreadcrumbs(slug, section.nav, section.root)
    : null;
  const around = section ? docsPrevNext(slug, section.nav) : null;

  return (
    <DocsShell>
      <div className="mx-auto flex w-full max-w-320 flex-col md:flex-row">
        <aside className="sticky top-[var(--site-chrome,4rem)] z-30 md:h-[calc(100dvh-var(--site-chrome,4rem))] md:w-64 md:shrink-0 md:overflow-y-auto md:overscroll-contain md:border-r md:border-border">
          <CmssyServerLayout
            groups={groups}
            blocks={blocks}
            position="sidebar_left"
            locale={locale}
            defaultLocale={locales.defaultLocale}
            enabledLocales={locales.locales}
            appContext={{ path: segments }}
          />
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
