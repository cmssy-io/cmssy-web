import { defineBlock, fields } from "@cmssy/react";
import ComparisonTable from "./ComparisonTable";

export const comparisonTableProps = {
  fig: fields.text({ label: "Fig Number", defaultValue: "FIG 5.0" }),
  eyebrow: fields.text({ label: "Eyebrow", defaultValue: "HOW WE COMPARE" }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "An honest look",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
    defaultValue: "Four things that actually differ. No trash-talk.",
  }),
  competitors: fields.repeater({
    label: "Competitor Columns",
    itemSchema: {
      name: fields.text({ label: "Name", required: true }),
    },
  }),
  rows: fields.repeater({
    label: "Rows",
    itemSchema: {
      label: fields.text({ label: "Row Label", required: true }),
      cmssy: fields.text({ label: "cmssy Value", required: true }),
      values: fields.text({
        label: "Competitor Values (| separated)",
        placeholder: "— | — | Add-on | —",
        required: true,
      }),
    },
  }),
  footnote: fields.text({
    label: "Footnote",
    defaultValue:
      "Comparison reflects standard plans as of 2026. Competitor capabilities vary by tier.",
  }),
};

export const comparisonTableBlock = defineBlock({
  type: "comparison-table",
  category: "Marketing",
  label: "Comparison Table",
  description:
    "Competitor comparison table with a highlighted cmssy column; horizontally scrollable on small screens.",
  component: ComparisonTable,
  props: comparisonTableProps,
});
