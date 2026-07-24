import nextDynamic from "next/dynamic";
import { createCmssyEditPage } from "@cmssy/next/server";
import { resolveEditorOrigin } from "@cmssy/next";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
import {
  getLayoutGroups,
  getSiteConfig,
  siteLocales,
  splitLocaleFromPath,
} from "@/cmssy/site";

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

export default async function EditPage({ params, searchParams }: PageProps) {
  const { path } = await params;
  const siteConfig = await getSiteConfig();
  const locales = siteLocales(siteConfig);
  const { path: strippedPath, locale } = splitLocaleFromPath(path, locales);
  const slug = "/" + (strippedPath ?? []).join("/");

  const [groups, content] = await Promise.all([
    getLayoutGroups(slug, cmssy.draftSecret),
    renderEditPage({ params: Promise.resolve({ path }), searchParams }),
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
          defaultLocale={locales.defaultLocale}
          enabledLocales={locales.locales}
          edit={{ editorOrigin }}
        />
      </div>
      <main className="min-w-0 flex-1">{content}</main>
    </div>
  );
}
