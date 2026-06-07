import type { CmssyNextConfig } from "@cmssy/next";

export const enabledLocales = ["en", "pl"] as const;
export type Locale = (typeof enabledLocales)[number];

// The SDK POSTs GraphQL directly to `apiUrl`, so it must be the full endpoint
// (e.g. https://api.cmssy.io/graphql) - same value the CLI/MCP use.
export const cmssy: CmssyNextConfig = {
  apiUrl: process.env.CMSSY_API_URL ?? "",
  workspaceSlug: process.env.CMSSY_WORKSPACE_SLUG ?? "",
  draftSecret: process.env.CMSSY_DRAFT_SECRET ?? "",
  editorOrigin: process.env.CMSSY_EDITOR_ORIGIN ?? "",
  defaultLocale: "en",
  enabledLocales: [...enabledLocales],
  // Locale is resolved from the header set by proxy.ts (`/pl/*` -> "pl").
  // Imported lazily so middleware can import this module without pulling in
  // `next/headers`.
  resolveLocale: async () => {
    const { headers } = await import("next/headers");
    const h = await headers();
    return h.get("x-cmssy-locale") ?? "en";
  },
};
