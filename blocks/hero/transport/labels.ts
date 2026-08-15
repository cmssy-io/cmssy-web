import type { StationKey } from "./useTransportSequence";

export interface TransportLabels {
  mcp: string;
  mcpTool: string;
  block: string;
  blockFields: string;
  fan: string;
  fanNote: string;
  locales: string[];
  publish: string;
  publishTool: string;
  frontend: string;
  code: string[];
  revalidated: string;
  deploys: string;
  diagramAria: string;
  stationAria: Record<StationKey, string>;
}

export interface LabelInput {
  mcpLabel?: string;
  mcpTool?: string;
  blockLabel?: string;
  blockFields?: string;
  fanLabel?: string;
  fanNote?: string;
  locales?: { code?: string }[];
  publishLabel?: string;
  publishTool?: string;
  frontendLabel?: string;
  codeLines?: { line?: string }[];
  revalidatedLabel?: string;
  deploysLabel?: string;
}

const FALLBACK_LOCALES = ["en", "pl", "de", "fr", "es"];

const FALLBACK_CODE = [
  "import { blocks }",
  "export default",
  "  createCmssyPage(...);",
];

export function buildLabels(input: LabelInput): TransportLabels {
  const locales = (input.locales ?? [])
    .map((l) => l.code?.trim())
    .filter((c): c is string => Boolean(c));

  const code = (input.codeLines ?? [])
    .map((l) => l.line ?? "")
    .filter((l) => l.length > 0);

  const resolved = {
    mcp: input.mcpLabel || "MCP",
    mcpTool: input.mcpTool || "update_block_content",
    block: input.blockLabel || "BLOCK · HERO",
    blockFields: input.blockFields || "heading · text",
    fan: input.fanLabel || "LOCALE FAN",
    fanNote: input.fanNote || "one field, five values",
    locales: locales.length === 5 ? locales : FALLBACK_LOCALES,
    publish: input.publishLabel || "PUBLISH",
    publishTool: input.publishTool || "publish_page · hmac",
    frontend: input.frontendLabel || "YOUR FRONTEND",
    code: code.length > 0 ? code.slice(0, 3) : FALLBACK_CODE,
    revalidated: input.revalidatedLabel || "REVALIDATED",
    deploys: input.deploysLabel || "DEPLOYS",
  };

  return {
    ...resolved,
    diagramAria: `${resolved.mcp} writes one field on ${resolved.block}; cmssy keys it to ${resolved.locales.length} locales and publishes; ${resolved.frontend} revalidates with 0 deploys.`,
    stationAria: {
      mcp: `${resolved.mcp}: ${resolved.mcpTool}`,
      block: `${resolved.block}: ${resolved.blockFields}`,
      fan: `${resolved.fan}: ${resolved.locales.join(", ")}`,
      publish: `${resolved.publish}: ${resolved.publishTool}`,
      frontend: `${resolved.frontend}: unchanged, 0 deploys`,
    },
  };
}
