import { defineBlock, fields } from "@cmssy/react";
import DemoVideo from "./DemoVideo";

export const demoVideoProps = {
  badgeText: fields.text({
    label: "Badge Text",
    placeholder: "See it in action",
  }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "Watch AI build a page",
    required: true,
  }),
  headingHighlight: fields.text({
    label: "Heading Highlight",
    defaultValue: "in seconds",
  }),
  subheading: fields.textarea({
    label: "Subheading",
    placeholder: "Describe what the video shows",
  }),
  videoUrl: fields.media({
    label: "Video",
    placeholder: "Upload the demo video (mp4/webm)",
  }),
  poster: fields.media({
    label: "Poster Image",
    placeholder: "Thumbnail shown before playback",
  }),
  autoplay: fields.boolean({
    label: "Autoplay (muted loop)",
    defaultValue: false,
  }),
};

export const demoVideoBlock = defineBlock({
  type: "demo-video",
  category: "Media",
  label: "Demo Video",
  description:
    "Embedded product demo video with heading and optional poster; a high-impact showcase section placed early on a marketing or home page.",
  component: DemoVideo,
  props: demoVideoProps,
});
