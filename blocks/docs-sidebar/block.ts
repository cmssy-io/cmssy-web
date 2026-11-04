import { defineBlock } from "@cmssy/react";
import { loadDocsSectionFor } from "@/lib/docs-section-loader";
import DocsSidebar from "./DocsSidebar";

export const docsSidebarBlock = defineBlock({
  type: "docs-sidebar",
  category: "Docs",
  label: "Docs Sidebar",
  description:
    "Navigation for the active docs area, built from the page tree; add it to the docs root's layout and every page below inherits it.",
  layoutRegions: ["sidebar_left"],
  loader: ({ context }) => loadDocsSectionFor(context),
  component: DocsSidebar,
  props: {},
});
