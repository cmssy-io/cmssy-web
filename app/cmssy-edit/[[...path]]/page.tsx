import nextDynamic from "next/dynamic";
import { createCmssyEditPage, resolveCmssyLayout } from "@cmssy/next/server";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
import { DocsFrame } from "@/components/docs-frame";
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
    <DocsFrame section={section} sidebar={sidebar.element} showSidebar>
      {content}
    </DocsFrame>
  );
}
