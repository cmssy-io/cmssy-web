import { createCmssyNotFound } from "@cmssy/next";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";

export default createCmssyNotFound(cmssy, blocks);
