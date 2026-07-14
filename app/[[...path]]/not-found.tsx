import { createCmssyNotFound } from "@cmssy/next/server";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";

export default createCmssyNotFound(cmssy, blocks);
