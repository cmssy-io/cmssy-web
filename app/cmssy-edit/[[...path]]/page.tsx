import nextDynamic from "next/dynamic";
import { createCmssyEditPage, resolveCmssyLayout } from "@cmssy/next/server";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
import { DocsShell } from "@/components/docs-shell";
import { DocsTabs } from "@/components/docs-tabs";
import { loadDocsSection } from "@/lib/docs-section";
import { regionHasBlocks } from "@/lib/layout-regions";

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
  const [content, sidebar] = await Promise.all([
    renderEditPage({ params: Promise.resolve({ path }), searchParams }),
    resolveCmssyLayout(cmssy, {
      region: "sidebar_left",
      blocks,
      path: path ?? [],
      editMode: true,
      editable: EditableLayout,
    }),
  ]);

  if (!regionHasBlocks(sidebar.groups, "sidebar_left")) return content;

  const section = await loadDocsSection(
    sidebar.page.path,
    sidebar.locale,
    sidebar.defaultLocale,
  );

  return (
    <DocsShell>
      {section ? (
        <DocsTabs
          root={section.root}
          areas={section.areas}
          searchItems={section.searchItems}
          ui={section.ui}
        />
      ) : null}
      <div className="mx-auto flex w-full max-w-320 flex-col md:flex-row">
        {section?.area ? (
          <aside className="sticky top-[calc(var(--site-chrome,4rem)+var(--docs-tabs,0px))] z-30 md:h-[calc(100dvh-var(--site-chrome,4rem)-var(--docs-tabs,0px))] md:w-64 md:shrink-0 md:overflow-y-auto md:overscroll-contain md:border-r md:border-border">
            {sidebar.element}
          </aside>
        ) : null}
        <main className="min-w-0 flex-1">{content}</main>
      </div>
    </DocsShell>
  );
}
