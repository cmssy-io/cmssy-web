export type SceneTarget =
  | "headline"
  | "button"
  | "accent"
  | "layout"
  | "model"
  | "api";

export const SCENE_TARGETS: SceneTarget[] = [
  "headline",
  "button",
  "accent",
  "layout",
  "model",
  "api",
];

export interface SceneStep {
  prompt: string;
  target: SceneTarget;
  text: string;
  detail: string;
  tools: string[];
  reply: string;
}

export interface ModelField {
  name: string;
  type: string;
}

export interface SceneLabels {
  siteBrand: string;
  siteDomain: string;
  siteNav: string[];
  siteHeadline: string;
  siteButton: string;
  productName: string;
  productPrice: string;
  modelName: string;
  modelFields: ModelField[];
  agentName: string;
  chatTitle: string;
  thinkingLabel: string;
  composerPlaceholder: string;
  steps: SceneStep[];
}

export interface SceneInput {
  siteBrand?: string;
  siteDomain?: string;
  siteNav?: string;
  siteHeadline?: string;
  siteButton?: string;
  productName?: string;
  productPrice?: string;
  modelName?: string;
  modelFields?: string;
  agentName?: string;
  chatTitle?: string;
  thinkingLabel?: string;
  composerPlaceholder?: string;
  steps?: {
    prompt?: string;
    target?: string;
    text?: string;
    detail?: string;
    tool?: string;
    reply?: string;
  }[];
}

export const FALLBACK_STEPS = [
  {
    prompt: "Make the hero headline bolder",
    target: "headline",
    text: "Silence, on demand.",
    detail: "",
    tool: "update_block_content",
    reply: "Rewrote the hero headline.",
  },
  {
    prompt: "Switch the accent to mint",
    target: "accent",
    text: "#6ee7b7",
    detail: "",
    tool: "update_block_content · style",
    reply: "Button and highlights are mint now.",
  },
  {
    prompt: "Put the product photo on the left",
    target: "layout",
    text: "",
    detail: "",
    tool: "update_block_content · layout",
    reply: "Swapped the hero columns.",
  },
  {
    prompt: "Add battery life to every product",
    target: "model",
    text: "batteryLife",
    detail: "40h battery",
    tool: "update_model · Product + bulk_update_records · 12",
    reply: "Added batteryLife to Product and filled all 12 records.",
  },
  {
    prompt: "Show me that product as JSON",
    target: "api",
    text: "",
    detail: "",
    tool: "query product · delivery API",
    reply: "Same content, served to any frontend.",
  },
];

const COLOR = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla|oklch|oklab)\([^)]*\))$/i;

const DEFAULT_MODEL_FIELDS = "name:Text · price:Number · color:Select";

function splitDots(value: string): string[] {
  return value
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toStep(input: NonNullable<SceneInput["steps"]>[number]): SceneStep {
  const target = SCENE_TARGETS.includes(input.target as SceneTarget)
    ? (input.target as SceneTarget)
    : "headline";
  return {
    prompt: input.prompt?.trim() ?? "",
    target,
    text: input.text?.trim() ?? "",
    detail: input.detail?.trim() ?? "",
    tools: (input.tool ?? "")
      .split(/\s+\+\s+/)
      .map((t) => t.trim())
      .filter(Boolean),
    reply: input.reply?.trim() ?? "",
  };
}

function isPlayable(step: SceneStep): boolean {
  if (!step.prompt) return false;
  switch (step.target) {
    case "layout":
    case "api":
      return true;
    case "accent":
      return COLOR.test(step.text);
    case "model":
      return Boolean(step.text && step.detail);
    default:
      return Boolean(step.text);
  }
}

export function buildSceneLabels(input: SceneInput): SceneLabels {
  const steps = (input.steps ?? []).map(toStep).filter(isPlayable);

  const modelFields = splitDots(input.modelFields || DEFAULT_MODEL_FIELDS).map(
    (f) => {
      const [name, type] = f.split(":").map((s) => s.trim());
      return { name, type: type || "Text" };
    },
  );

  return {
    siteBrand: input.siteBrand || "Orbit",
    siteDomain: input.siteDomain || "orbit.audio",
    siteNav: splitDots(input.siteNav || "Shop · Orbit 2 · Support"),
    siteHeadline: input.siteHeadline || "Sound, unplugged.",
    siteButton: input.siteButton || "Shop now",
    productName: input.productName || "Orbit 2",
    productPrice: input.productPrice || "$349",
    modelName: input.modelName || "Product",
    modelFields,
    agentName: input.agentName || "Claude",
    chatTitle: input.chatTitle || "Orbit store",
    thinkingLabel: input.thinkingLabel || "Thinking",
    composerPlaceholder: input.composerPlaceholder || "Reply to Claude",
    steps:
      steps.length > 0 ? steps : FALLBACK_STEPS.map(toStep).filter(isPlayable),
  };
}
