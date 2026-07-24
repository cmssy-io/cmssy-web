import { buildCmssyMetadata, createCmssyPage } from "@cmssy/next/server";
import { splitCmssyLocale, fetchPages } from "@cmssy/core";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { DocsShell } from "@/components/docs-shell";
import { DocsSidebarNav } from "@/components/docs-sidebar-nav";
import { buildDocsNav, type DocsNavSection } from "@/lib/docs-nav";
import { DOCS_NAV_CONFIG } from "@/lib/docs-nav.config";

export const revalidate = 3600;
export const dynamicParams = true;

const renderPage = createCmssyPage(cmssy, blocks);

type PageProps = {
  params: Promise<{ path?: string[] }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  return buildCmssyMetadata(cmssy, path);
}

// Docs navigation derived from the published page tree (see lib/docs-nav.ts).
async function getDocsNav(): Promise<DocsNavSection[]> {
  try {
    const pages = await fetchPages({
      apiUrl: cmssy.apiUrl,
      org: cmssy.org,
      workspaceSlug: cmssy.workspaceSlug,
    });
    return buildDocsNav(pages, DOCS_NAV_CONFIG);
  } catch {
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const { path } = await params;
  const { path: strippedPath } = await splitCmssyLocale(cmssy, path);
  const slug = "/" + (strippedPath ?? []).join("/");
  const isDocs = slug === "/docs" || slug.startsWith("/docs/");

  const [content, nav] = await Promise.all([
    renderPage({ params: Promise.resolve({ path }) }),
    isDocs ? getDocsNav() : Promise.resolve<DocsNavSection[]>([]),
  ]);

  if (!isDocs) return content;

  return (
    <DocsShell>
      <div className="flex flex-col md:flex-row">
        <aside className="md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-border">
          <DocsSidebarNav sections={nav} />
        </aside>
        <main className="min-w-0 flex-1">{content}</main>
      </div>
    </DocsShell>
  );
}
