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

const COLOR = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

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

  const modelFields = pairs(input.modelFields ?? "").map(
    ([name, type]) => ({ name, type: type || "Text" }),
  );

  const variants = pairs(input.productVariants ?? "")
    .filter(([, color]) => COLOR.test(color))
    .map(([name, color]) => ({ name, color }));

  return {
    siteBrand: input.siteBrand ?? "",
    siteDomain: input.siteDomain ?? "",
    siteNav: splitDots(input.siteNav ?? ""),
    siteHeadline: input.siteHeadline ?? "",
    siteButton: input.siteButton ?? "",
    productName: input.productName ?? "",
    productPrice: input.productPrice ?? "",
    variants,
    modelName: input.modelName ?? "",
    modelFields,
    adminLabel: input.adminLabel ?? "",
    adminNav: splitDots(input.adminNav ?? ""),
    recordCount: input.recordCount ?? "",
    addFieldLabel: input.addFieldLabel ?? "",
    addVariantLabel: input.addVariantLabel ?? "",
    savedLabel: input.savedLabel ?? "",
    queryStatus: input.queryStatus ?? "",
    agentName: input.agentName ?? "",
    chatTitle: input.chatTitle ?? "",
    thinkingLabel: input.thinkingLabel ?? "",
    composerPlaceholder: input.composerPlaceholder ?? "",
    steps,
  };
}

export function playableScene(
  input: SceneInput & { showScene?: boolean | null },
): SceneLabels | null {
  if (input.showScene === false) return null;
  const labels = buildSceneLabels(input);
  return labels.steps.length > 0 ? labels : null;
}
