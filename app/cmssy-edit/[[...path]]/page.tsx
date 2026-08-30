import nextDynamic from "next/dynamic";
import { createCmssyEditPage } from "@cmssy/next/server";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";

export const dynamic = "force-dynamic";

const CmssyEditor = nextDynamic(() =>
  import("@/cmssy/editor").then((m) => m.CmssyEditor),
);

export default createCmssyEditPage(cmssy, blocks, {
  editor: CmssyEditor,
});
