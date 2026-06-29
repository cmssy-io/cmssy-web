import type { CmssyNextConfig } from "@cmssy/next";

export const enabledLocales = ["en", "pl"] as const;
export type Locale = (typeof enabledLocales)[number];

// apiUrl + editorOrigin default to cmssy cloud (api.cmssy.io / www.cmssy.io);
// they're only set here to override for local dev or self-hosting.
export const cmssy: CmssyNextConfig = {
  workspaceSlug: process.env.CMSSY_WORKSPACE_SLUG ?? "",
  draftSecret: process.env.CMSSY_DRAFT_SECRET ?? "",
  ...(process.env.CMSSY_API_URL ? { apiUrl: process.env.CMSSY_API_URL } : {}),
  ...(process.env.CMSSY_EDITOR_ORIGIN
    ? { editorOrigin: process.env.CMSSY_EDITOR_ORIGIN }
    : {}),
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
