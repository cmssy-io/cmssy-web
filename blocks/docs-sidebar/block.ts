import { defineBlock } from "@cmssy/react";
import type { DocsSection } from "@/lib/docs-section";
import DocsSidebar from "./DocsSidebar";

export const docsSidebarBlock = defineBlock({
  type: "docs-sidebar",
  category: "Docs",
  label: "Docs Sidebar",
  description:
    "Section navigation built from the page tree the block is placed on; add it to a section root's layout and every page below inherits it.",
  layoutPositions: ["sidebar_left"],
  loader: async ({ context }): Promise<DocsSection | null> => {
    const app = context?.app as { path?: string[] } | undefined;
    if (!context || !app?.path) return null;
    const { loadDocsSection } = await import("@/lib/docs-section");
    return loadDocsSection(
      app.path,
      context.locale.current,
      context.locale.default,
    );
  },
  component: DocsSidebar,
  props: {},
});
