import { createDraftRoute } from "@cmssy/next";
import { cmssy } from "@/cmssy/config";

export const GET = createDraftRoute(cmssy);
