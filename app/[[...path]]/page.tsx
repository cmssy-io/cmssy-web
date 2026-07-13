import { draftMode } from "next/headers";
import {
  fetchLayouts,
  resolveSiteLocales,
  CmssyServerLayout,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import {
  buildCmssyMetadata,
  createCmssyPage,
  splitCmssyLocale,
} from "@cmssy/next";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";

export const revalidate = 3600;
export const dynamicParams = true;

const renderPage = createCmssyPage(cmssy, blocks);

type PageProps = {
  params: Promise<{ path?: string[] }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  const { path: stripped } = await splitCmssyLocale(cmssy, path);
  return buildCmssyMetadata(cmssy, stripped);
}

async function getPageLayoutGroups(
  slug: string,
  draft: boolean,
): Promise<CmssyLayoutGroup[]> {
  try {
    return await fetchLayouts(
      {
        apiUrl: cmssy.apiUrl,
        org: cmssy.org,
        workspaceSlug: cmssy.workspaceSlug,
      },
      slug,
      { previewSecret: draft ? cmssy.draftSecret : undefined },
    );
  } catch {
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const { path } = await params;
  const { path: strippedPath, locale } = await splitCmssyLocale(cmssy, path);
  const slug = "/" + (strippedPath ?? []).join("/");
  const { isEnabled: draft } = await draftMode();

  const [groups, content, siteLocales] = await Promise.all([
    getPageLayoutGroups(slug, draft),
    renderPage({ params: Promise.resolve({ path }) }),
    resolveSiteLocales(cmssy),
  ]);
  const sidebar = groups.find((g) => g.position === "sidebar_left");
  const hasSidebar = !!sidebar && sidebar.blocks.length > 0;

  if (!hasSidebar) return content;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-border">
        <CmssyServerLayout
          groups={groups}
          blocks={blocks}
          position="sidebar_left"
          locale={locale}
          defaultLocale={siteLocales.defaultLocale}
          enabledLocales={siteLocales.locales}
        />
      </div>
      <main className="min-w-0 flex-1">{content}</main>
    </div>
  );
}
