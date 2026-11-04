import { defineBlock, fields } from "@cmssy/react";
import type { DocsSection } from "@/lib/docs-section";
import DocsAreas from "./DocsAreas";

export const docsAreasProps = {
  fig: fields.text({
    label: "FIG number",
    placeholder: "e.g., 2.0",
    localized: false,
  }),
  eyebrow: fields.text({ label: "Eyebrow", placeholder: "e.g., By area" }),
  heading: fields.text({ label: "Heading" }),
  description: fields.textarea({ label: "Description" }),
  band: fields.select({
    label: "Band",
    defaultValue: "muted",
    options: ["paper", "muted", "ink"],
    tab: "style",
  }),
};

export const docsAreasBlock = defineBlock({
  type: "docs-areas",
  category: "Docs",
  label: "Docs Areas",
  description:
    "Every documentation area as a card, read from the page tree under the docs root; for the docs landing page.",
  loader: async ({ context }): Promise<DocsSection | null> => {
    if (!context?.page) return null;
    const { loadDocsSection } = await import("@/lib/docs-section");
    return loadDocsSection(
      context.page.path,
      context.locale.current,
      context.locale.default,
    );
  },
  component: DocsAreas,
  props: docsAreasProps,
});
