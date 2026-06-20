import dynamic from "next/dynamic";
import {
  fetchLayouts,
  CmssyServerLayout,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import {
  buildCmssyMetadata,
  createCmssyPage,
  isCmssyEditMode,
} from "@cmssy/next";
import { cmssy, enabledLocales } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";

export const revalidate = 3600;
export const dynamicParams = true;

const CmssyEditor = dynamic(() =>
  import("@/cmssy/editor").then((m) => m.CmssyEditor),
);

const renderPage = createCmssyPage(cmssy, blocks, { editor: CmssyEditor });

const nonDefaultLocales: readonly string[] = enabledLocales.filter(
  (l) => l !== cmssy.defaultLocale,
);

function stripLocale(path: string[] | undefined): string[] | undefined {
  const first = path?.[0];
  if (first && nonDefaultLocales.includes(first)) {
    return path!.slice(1);
  }
  return path;
}

type PageProps = {
  params: Promise<{ path?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  return buildCmssyMetadata(cmssy, stripLocale(path));
}

async function getPageLayoutGroups(
  slug: string,
  editMode: boolean,
): Promise<CmssyLayoutGroup[]> {
  try {
    return await fetchLayouts(
      { apiUrl: cmssy.apiUrl, workspaceSlug: cmssy.workspaceSlug },
      slug,
      { previewSecret: editMode ? cmssy.draftSecret : undefined },
    );
  } catch {
    return [];
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { path } = await params;
  const strippedPath = stripLocale(path);
  const slug = "/" + (strippedPath ?? []).join("/");

  const editMode = await isCmssyEditMode();
  const [groups, content] = await Promise.all([
    getPageLayoutGroups(slug, editMode),
    renderPage({
      params: Promise.resolve({ path: strippedPath }),
      searchParams,
    }),
  ]);
  const sidebar = groups.find((g) => g.position === "sidebar_left");
  const hasSidebar = !!sidebar && sidebar.blocks.length > 0;

  if (!hasSidebar) return content;

  const locale = (await cmssy.resolveLocale?.()) ?? cmssy.defaultLocale ?? "en";
  const editorOrigin = Array.isArray(cmssy.editorOrigin)
    ? cmssy.editorOrigin[0]
    : cmssy.editorOrigin;

  const sidebarSlot = editMode ? (
    <EditableLayout
      groups={groups}
      position="sidebar_left"
      locale={locale}
      defaultLocale={cmssy.defaultLocale ?? "en"}
      enabledLocales={[...enabledLocales]}
      edit={{ editorOrigin }}
    />
  ) : (
    <CmssyServerLayout
      groups={groups}
      blocks={blocks}
      position="sidebar_left"
      locale={locale}
      defaultLocale={cmssy.defaultLocale ?? "en"}
      enabledLocales={[...enabledLocales]}
    />
  );

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-border">
        {sidebarSlot}
      </div>
      <main className="min-w-0 flex-1">{content}</main>
    </div>
  );
}
