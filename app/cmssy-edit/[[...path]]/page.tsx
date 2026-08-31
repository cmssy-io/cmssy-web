import nextDynamic from "next/dynamic";
import { createCmssyEditPage, resolveCmssyLayout } from "@cmssy/next/server";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
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

  return (
    <div className="mx-auto flex w-full max-w-320 flex-col md:flex-row">
      <aside className="sticky top-[var(--site-chrome,4rem)] z-30 md:h-[calc(100dvh-var(--site-chrome,4rem))] md:w-64 md:shrink-0 md:overflow-y-auto md:overscroll-contain md:border-r md:border-border">
        {sidebar.element}
      </aside>
      <main className="min-w-0 flex-1">{content}</main>
    </div>
  );
}
