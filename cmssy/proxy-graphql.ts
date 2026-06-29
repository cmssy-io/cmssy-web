import { NextResponse, type NextRequest } from "next/server";
import { getCmssyAccessToken } from "@cmssy/next";
import { cmssy } from "./config";

/**
 * Forwards a client GraphQL request to the cmssy public delivery endpoint.
 * Used by client blocks that query at runtime (blog-posts listing/search,
 * contact form submit). Only the public* queries/mutations are reachable
 * without a token; we forward the body verbatim.
 */
export async function proxyGraphql(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ message: "Invalid JSON body" }] },
      { status: 400 },
    );
  }

  const workspaceId =
    process.env.CMSSY_WORKSPACE_ID ??
    process.env.NEXT_PUBLIC_CMSSY_WORKSPACE_ID;

  try {
    const upstream = await fetch(cmssy.apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // Some public queries (e.g. publicForm) are scoped by workspace id.
        ...(workspaceId ? { "x-workspace-id": workspaceId } : {}),
      },
      body: JSON.stringify(body),
    });
    const json = await upstream.json();
    return NextResponse.json(json, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { errors: [{ message: "Upstream request failed" }] },
      { status: 502 },
    );
  }
}

/**
 * Forwards a member-authenticated GraphQL request. Reads the member's access
 * token from the httpOnly session cookie (via getCmssyAccessToken) and forwards
 * it as a Bearer header, so member-scoped mutations (e.g. siteMemberUpdateProfile)
 * are authenticated without the token ever reaching client JS. Requires
 * `config.auth`; returns 401 when auth is unconfigured or no session exists.
 */
export async function proxyMemberGraphql(request: NextRequest) {
  if (!cmssy.auth) {
    return NextResponse.json(
      { errors: [{ message: "Member auth is not configured" }] },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ message: "Invalid JSON body" }] },
      { status: 400 },
    );
  }

  const token = await getCmssyAccessToken(cmssy);
  if (!token) {
    return NextResponse.json(
      { errors: [{ message: "Not authenticated" }] },
      { status: 401 },
    );
  }

  const workspaceId =
    process.env.CMSSY_WORKSPACE_ID ??
    process.env.NEXT_PUBLIC_CMSSY_WORKSPACE_ID;

  try {
    const upstream = await fetch(cmssy.apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
        ...(workspaceId ? { "x-workspace-id": workspaceId } : {}),
      },
      body: JSON.stringify(body),
    });
    const json = await upstream.json();
    return NextResponse.json(json, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { errors: [{ message: "Upstream request failed" }] },
      { status: 502 },
    );
  }
}
