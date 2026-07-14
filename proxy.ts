import { NextResponse, type NextRequest } from "next/server";
import { applyCmssyCsp, cmssyEditRewrite } from "@cmssy/next/middleware";
import { cmssy } from "@/cmssy/config";

export async function proxy(request: NextRequest) {
  const rewrite = await cmssyEditRewrite(request, cmssy);
  if (rewrite) {
    applyCmssyCsp(rewrite, { editorOrigin: cmssy.editorOrigin });
    return rewrite;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
