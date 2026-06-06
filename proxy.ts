import { NextResponse, type NextRequest } from "next/server";
import {
  applyCmssyCsp,
  CMSSY_EDIT_HEADER,
  isCmssyEditRequest,
} from "@cmssy/next";
import { cmssy } from "@/cmssy/config";

const LOCALE_HEADER = "x-cmssy-locale";

function localeForPath(pathname: string): "en" | "pl" {
  return pathname === "/pl" || pathname.startsWith("/pl/") ? "pl" : "en";
}

export function proxy(request: NextRequest) {
  const editMode = isCmssyEditRequest(request);

  // Strip any inbound edit/locale headers first so a client can't forge them,
  // then set our own derived values for server components to read.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(CMSSY_EDIT_HEADER);
  requestHeaders.delete(LOCALE_HEADER);

  if (editMode) requestHeaders.set(CMSSY_EDIT_HEADER, "1");
  // Locale is derived from the URL (`/pl/*` -> pl) and exposed via this header
  // (read by resolveLocale + the root layout). No rewrite, so ISR cache keys
  // stay distinct per path; the catch-all route strips the locale segment
  // before querying cmssy.
  requestHeaders.set(LOCALE_HEADER, localeForPath(request.nextUrl.pathname));

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (editMode) {
    applyCmssyCsp(response, { editorOrigin: cmssy.editorOrigin });
  }
  return response;
}

export const config = {
  // Skip Next internals, the API routes, and files with an extension.
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
