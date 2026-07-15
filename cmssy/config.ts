import { defineCmssyConfig } from "@cmssy/next";

export const cmssy = defineCmssyConfig({
  // apiUrl: process.env.CMSSY_API_URL,
  org: process.env.CMSSY_ORG_SLUG,
  workspaceSlug: process.env.CMSSY_WORKSPACE_SLUG,
  draftSecret: process.env.CMSSY_DRAFT_SECRET,
  // editorOrigin: process.env.CMSSY_EDITOR_ORIGIN,
  devToken: process.env.CMSSY_API_TOKEN,
});
