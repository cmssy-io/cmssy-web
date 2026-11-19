export type SceneTarget =
  | "headline"
  | "button"
  | "accent"
  | "layout"
  | "variant"
  | "model";

export const SCENE_TARGETS: SceneTarget[] = [
  "headline",
  "button",
  "accent",
  "layout",
  "variant",
  "model",
];

export interface SceneStep {
  prompt: string;
  target: SceneTarget;
  text: string;
  detail: string;
  color: string;
  query: string;
  tools: string[];
  reply: string;
}

export interface ModelField {
  name: string;
  type: string;
}

export interface Variant {
  name: string;
  color: string;
}

export interface SceneLabels {
  siteBrand: string;
  siteDomain: string;
  siteNav: string[];
  siteHeadline: string;
  siteButton: string;
  productName: string;
  productPrice: string;
  variants: Variant[];
  modelName: string;
  modelFields: ModelField[];
  adminLabel: string;
  adminNav: string[];
  recordCount: string;
  addFieldLabel: string;
  addVariantLabel: string;
  savedLabel: string;
  queryStatus: string;
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
  productVariants?: string;
  modelName?: string;
  modelFields?: string;
  adminLabel?: string;
  adminNav?: string;
  recordCount?: string;
  addFieldLabel?: string;
  addVariantLabel?: string;
  savedLabel?: string;
  queryStatus?: string;
  agentName?: string;
  chatTitle?: string;
  thinkingLabel?: string;
  composerPlaceholder?: string;
  steps?: {
    prompt?: string;
    target?: string;
    text?: string;
    detail?: string;
    color?: string;
    query?: string;
    modelValue?: string;
    modelQuery?: string;
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
    color: "",
    query: "",
    tool: "update_block_content",
    reply: "Rewrote the hero headline.",
  },
  {
    prompt: "Add a Sand color to Orbit 2",
    target: "variant",
    text: "Sand",
    detail: "ORB2-SND · 40 in stock",
    color: "#d6b98c",
    query: 'product(slug: "orbit-2") { variants { name } }',
    tool: "update_model · color + set_product_variants · Orbit 2",
    reply: "Sand is live on the product page.",
  },
  {
    prompt: "Put the product photo on the left",
    target: "layout",
    text: "",
    detail: "",
    color: "",
    query: "",
    tool: "update_block_content · layout",
    reply: "Swapped the hero columns.",
  },
  {
    prompt: "Add battery life to every product",
    target: "model",
    text: "batteryLife",
    detail: "",
    color: "",
    query: "",
    modelValue: "40h battery",
    modelQuery: 'product(slug: "orbit-2") { batteryLife }',
    tool: "update_model · Product + bulk_update_records · 12",
    reply: "Added batteryLife to Product and filled all 12 records.",
  },
];

const COLOR = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const DEFAULT_MODEL_FIELDS = "name:Text · price:Number · color:Select";
const DEFAULT_VARIANTS = "Blue:#00a8f0 · Silver:#e8ebf0 · Graphite:#3a4252";

function splitDots(value: string): string[] {
  return value
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
}

function pairs(value: string): [string, string][] {
  return splitDots(value).map((f) => {
    const i = f.indexOf(":");
    return i < 0
      ? [f, ""]
      : [f.slice(0, i).trim(), f.slice(i + 1).trim()];
  });
}

function toStep(input: NonNullable<SceneInput["steps"]>[number]): SceneStep {
  const target = SCENE_TARGETS.includes(input.target as SceneTarget)
    ? (input.target as SceneTarget)
    : "headline";
  return {
    prompt: input.prompt?.trim() ?? "",
    target,
    text: input.text?.trim() ?? "",
    detail:
      (target === "model" ? input.modelValue : input.detail)?.trim() ?? "",
    color: input.color?.trim() ?? "",
    query:
      (target === "model" ? input.modelQuery : input.query)?.trim() ?? "",
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
      return true;
    case "accent":
      return COLOR.test(step.text);
    case "variant":
      return Boolean(step.text) && COLOR.test(step.color);
    case "model":
      return Boolean(step.text && step.detail);
    default:
      return Boolean(step.text);
  }
}

export function buildSceneLabels(input: SceneInput): SceneLabels {
  const steps = (input.steps ?? []).map(toStep).filter(isPlayable);

  const modelFields = pairs(input.modelFields || DEFAULT_MODEL_FIELDS).map(
    ([name, type]) => ({ name, type: type || "Text" }),
  );

  const variants = pairs(input.productVariants || DEFAULT_VARIANTS)
    .filter(([, color]) => COLOR.test(color))
    .map(([name, color]) => ({ name, color }));

  return {
    siteBrand: input.siteBrand || "Orbit",
    siteDomain: input.siteDomain || "orbit.audio",
    siteNav: splitDots(input.siteNav || "Shop · Orbit 2 · Support"),
    siteHeadline: input.siteHeadline || "Sound, unplugged.",
    siteButton: input.siteButton || "Shop now",
    productName: input.productName || "Orbit 2",
    productPrice: input.productPrice || "$349",
    variants,
    modelName: input.modelName || "Product",
    modelFields,
    adminLabel: input.adminLabel || "cmssy",
    adminNav: splitDots(input.adminNav || "Pages · Products · Models · Media"),
    recordCount: input.recordCount || "12 records",
    addFieldLabel: input.addFieldLabel || "Add field",
    addVariantLabel: input.addVariantLabel || "Add variant",
    savedLabel: input.savedLabel || "Saved",
    queryStatus: input.queryStatus || "200 · 38 ms",
    agentName: input.agentName || "Claude",
    chatTitle: input.chatTitle || "Orbit store",
    thinkingLabel: input.thinkingLabel || "Thinking",
    composerPlaceholder: input.composerPlaceholder || "Reply to Claude",
    steps:
      steps.length > 0 ? steps : FALLBACK_STEPS.map(toStep).filter(isPlayable),
  };
}
