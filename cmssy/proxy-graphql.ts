import { NextResponse, type NextRequest } from "next/server";
import { graphqlRequest } from "@cmssy/core";
import { cmssy } from "@/cmssy/config";

interface GraphqlBody {
  query?: unknown;
  variables?: unknown;
}

function readBody(
  body: unknown,
): { query: string; variables: Record<string, unknown> } | null {
  if (!body || typeof body !== "object") return null;
  const { query, variables } = body as GraphqlBody;
  if (typeof query !== "string" || query.trim() === "") return null;
  if (
    variables !== undefined &&
    (typeof variables !== "object" || variables === null)
  ) {
    return null;
  }
  return { query, variables: (variables as Record<string, unknown>) ?? {} };
}

export async function proxyGraphql(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ message: "Invalid JSON body" }] },
      { status: 400 },
    );
  }

  const body = readBody(raw);
  if (!body) {
    return NextResponse.json(
      { errors: [{ message: "A query string is required" }] },
      { status: 400 },
    );
  }

  try {
    const data = await graphqlRequest<Record<string, unknown>>(
      cmssy,
      body.query,
      body.variables,
      { public: true, retry: {} },
      "browser-proxy",
    );
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[cmssy-web] browser graphql proxy failed", error);
    return NextResponse.json(
      { errors: [{ message: "Upstream request failed" }] },
      { status: 502 },
    );
  }
}
