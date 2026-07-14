import { createCmssyRobots } from "@cmssy/next/server";
import { cmssy } from "@/cmssy/config";

export const dynamic = "force-dynamic";

export default createCmssyRobots(cmssy);
