import { NextResponse, type NextRequest } from "next/server";
import {
  applyCmssyCsp,
  CMSSY_EDIT_HEADER,
  CMSSY_LOCALE_HEADER,
  isCmssyEditRequest,
  localeForPathname,
} from "@cmssy/next";
import { cmssy } from "@/cmssy/config";

export async function proxy(request: NextRequest) {
  const editMode = isCmssyEditRequest(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(CMSSY_EDIT_HEADER);
  requestHeaders.delete(CMSSY_LOCALE_HEADER);
  if (editMode) requestHeaders.set(CMSSY_EDIT_HEADER, "1");
  requestHeaders.set(
    CMSSY_LOCALE_HEADER,
    await localeForPathname(cmssy, request.nextUrl.pathname),
  );

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (editMode) {
    applyCmssyCsp(response, { editorOrigin: cmssy.editorOrigin });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
