import { NextResponse, type NextRequest } from "next/server";
import { resolveApiUrl } from "@cmssy/react";
import { cmssy } from "./config";

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
    const upstream = await fetch(resolveApiUrl(cmssy.apiUrl), {
      method: "POST",
      headers: {
        "content-type": "application/json",
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
