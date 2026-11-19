export type SceneTarget = "headline" | "button" | "accent" | "layout";

export const SCENE_TARGETS: SceneTarget[] = [
  "headline",
  "button",
  "accent",
  "layout",
];

export interface SceneStep {
  prompt: string;
  target: SceneTarget;
  text: string;
  tool: string;
  reply: string;
}

export interface SceneLabels {
  siteBrand: string;
  siteDomain: string;
  siteNav: string[];
  siteHeadline: string;
  siteButton: string;
  agentName: string;
  chatTitle: string;
  thinkingLabel: string;
  steps: SceneStep[];
}

export interface SceneInput {
  siteBrand?: string;
  siteDomain?: string;
  siteNav?: string;
  siteHeadline?: string;
  siteButton?: string;
  agentName?: string;
  chatTitle?: string;
  thinkingLabel?: string;
  steps?: {
    prompt?: string;
    target?: string;
    text?: string;
    tool?: string;
    reply?: string;
  }[];
}

export const FALLBACK_STEPS: SceneStep[] = [
  {
    prompt: "Make the hero headline bolder",
    target: "headline",
    text: "Silence, on demand.",
    tool: "update_block_content",
    reply: "Rewrote the hero headline.",
  },
  {
    prompt: "Switch the accent to mint",
    target: "accent",
    text: "#6ee7b7",
    tool: "update_block_content · style",
    reply: "Button and highlights are mint now.",
  },
  {
    prompt: "Put the product photo on the left",
    target: "layout",
    text: "swap",
    tool: "update_block_content · layout",
    reply: "Swapped the hero columns.",
  },
  {
    prompt: "Translate it to German and publish",
    target: "headline",
    text: "Stille auf Knopfdruck.",
    tool: "publish_page · de",
    reply: "German hero is live.",
  },
];

export function buildSceneLabels(input: SceneInput): SceneLabels {
  const steps = (input.steps ?? [])
    .map((s) => ({
      prompt: s.prompt?.trim() ?? "",
      target: SCENE_TARGETS.includes(s.target as SceneTarget)
        ? (s.target as SceneTarget)
        : "headline",
      text: s.text?.trim() ?? "",
      tool: s.tool?.trim() ?? "",
      reply: s.reply?.trim() ?? "",
    }))
    .filter((s) => s.prompt && (s.text || s.target === "layout"));

  const nav = (input.siteNav || "Shop · Orbit 2 · Support")
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    siteBrand: input.siteBrand || "Orbit",
    siteDomain: input.siteDomain || "orbit.audio",
    siteNav: nav,
    siteHeadline: input.siteHeadline || "Sound, unplugged.",
    siteButton: input.siteButton || "Shop now",
    agentName: input.agentName || "Claude",
    chatTitle: input.chatTitle || "Orbit store",
    thinkingLabel: input.thinkingLabel || "Thinking",
    steps: steps.length > 0 ? steps : FALLBACK_STEPS,
  };
}
