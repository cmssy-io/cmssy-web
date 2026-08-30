import nextDynamic from "next/dynamic";
import { createCmssyEditPage } from "@cmssy/next/server";
import { resolveEditorOrigin } from "@cmssy/next";
import { resolveEditorLayoutBlockData } from "@cmssy/react";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
import { splitLocaleFromPath } from "@/lib/locale-path";
import { fetchChromeLayouts } from "@/services/layout";
import { resolveSiteLocales } from "@/services/site";

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
  const locales = await resolveSiteLocales();
  const { path: strippedPath, locale } = splitLocaleFromPath(path, locales);
  const segments = strippedPath ?? [];
  const slug = "/" + segments.join("/");

  const [groups, content] = await Promise.all([
    fetchChromeLayouts(slug, cmssy.draftSecret),
    renderEditPage({ params: Promise.resolve({ path }), searchParams }),
  ]);
  const sidebar = groups.find((group) => group.position === "sidebar_left");
  if (!sidebar?.blocks.some((block) => block.isActive)) return content;

  const { data, content: resolvedContent } = await resolveEditorLayoutBlockData(
    {
      groups,
      blocks,
      position: "sidebar_left",
      locale,
      defaultLocale: locales.defaultLocale,
      enabledLocales: locales.locales,
      isPreview: true,
      config: cmssy,
      appContext: { path: segments },
    },
  );
  const editorOrigin = resolveEditorOrigin(cmssy.editorOrigin);

  return (
    <div className="mx-auto flex w-full max-w-320 flex-col md:flex-row">
      <aside className="sticky top-[var(--site-chrome,4rem)] z-30 md:h-[calc(100dvh-var(--site-chrome,4rem))] md:w-64 md:shrink-0 md:overflow-y-auto md:overscroll-contain md:border-r md:border-border">
        <EditableLayout
          groups={groups}
          position="sidebar_left"
          locale={locale}
          defaultLocale={locales.defaultLocale}
          enabledLocales={locales.locales}
          edit={{ editorOrigin }}
          data={data}
          resolvedContent={resolvedContent}
          appContext={{ path: segments }}
        />
      </aside>
      <main className="min-w-0 flex-1">{content}</main>
    </div>
  );
}
