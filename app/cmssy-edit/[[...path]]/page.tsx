import nextDynamic from "next/dynamic";
import {
  fetchLayouts,
  resolveSiteLocales,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import { createCmssyEditPage } from "@cmssy/next/server";
import { resolveEditorOrigin } from "@cmssy/next";
import { splitCmssyLocale } from "@cmssy/core";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";

export const dynamic = "force-dynamic";

const CmssyEditor = nextDynamic(() =>
  import("@/cmssy/editor").then((m) => m.CmssyEditor),
);

const renderEditPage = createCmssyEditPage(cmssy, blocks, {
  editor: CmssyEditor,
});

type PageProps = {
  params: Promise<{ path?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function getPageLayoutGroups(slug: string): Promise<CmssyLayoutGroup[]> {
  try {
    return await fetchLayouts(
      {
        apiUrl: cmssy.apiUrl,
        org: cmssy.org,
        workspaceSlug: cmssy.workspaceSlug,
      },
      slug,
      { previewSecret: cmssy.draftSecret },
    );
  } catch {
    return [];
  }
}

export default async function EditPage({ params, searchParams }: PageProps) {
  const { path } = await params;
  const { path: strippedPath, locale } = await splitCmssyLocale(cmssy, path);
  const slug = "/" + (strippedPath ?? []).join("/");

  const [groups, content, siteLocales] = await Promise.all([
    getPageLayoutGroups(slug),
    renderEditPage({ params: Promise.resolve({ path }), searchParams }),
    resolveSiteLocales(cmssy),
  ]);
  const sidebar = groups.find((g) => g.position === "sidebar_left");
  const hasSidebar = !!sidebar && sidebar.blocks.length > 0;

  if (!hasSidebar) return content;

  const resolvedEditorOrigin = resolveEditorOrigin(cmssy.editorOrigin);
  const editorOrigin = Array.isArray(resolvedEditorOrigin)
    ? resolvedEditorOrigin[0]
    : resolvedEditorOrigin;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-border">
        <EditableLayout
          groups={groups}
          position="sidebar_left"
          locale={locale}
          defaultLocale={siteLocales.defaultLocale}
          enabledLocales={siteLocales.locales}
          edit={{ editorOrigin }}
        />
      </div>
      <main className="min-w-0 flex-1">{content}</main>
    </div>
  );
}
