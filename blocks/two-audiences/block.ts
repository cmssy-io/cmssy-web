import { defineBlock, fields } from "@cmssy/react";
import TwoAudiences from "./TwoAudiences";

export const twoAudiencesProps = {
  fig: fields.text({ label: "Fig Number" }),
  eyebrow: fields.text({
    label: "Eyebrow",
  }),
  heading: fields.text({
    label: "Heading",
    defaultValue:
      "Business teams manage content. Developers own the frontend.",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
  }),
  cards: fields.repeater({
    label: "Cards",
    itemSchema: {
      kicker: fields.text({ label: "Kicker", required: true }),
      title: fields.text({ label: "Title", required: true }),
      description: fields.textarea({ label: "Description", required: true }),
      code: fields.textarea({
        label: "Code Snippet",
        placeholder: "Optional - dark card shows code instead of wireframe",
      }),
      codeLabel: fields.text({
        label: "Code Panel Label",
      }),
      wireframeCaption: fields.text({
        label: "Wireframe Caption",
      }),
      dark: fields.boolean({ label: "Dark Card" }),
    },
  }),
};

export const twoAudiencesBlock = defineBlock({
  type: "two-audiences",
  category: "Marketing",
  label: "Two Audiences",
  description:
    "Two side-by-side persona cards (content teams vs developers) - light editor wireframe and dark code card.",
  component: TwoAudiences,
  props: twoAudiencesProps,
});
