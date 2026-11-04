import { defineBlock, fields } from "@cmssy/react";
import { loadDocsSectionFor } from "@/lib/docs-section-loader";
import DocsAreas from "./DocsAreas";

export const docsAreasProps = {
  fig: fields.text({
    label: "FIG Number",
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
  loader: ({ context }) => loadDocsSectionFor(context),
  component: DocsAreas,
  props: docsAreasProps,
});
