import { NextResponse } from "next/server";
import {
  graphqlRequest,
  FORM_QUERY,
  type CmssyFormDefinition,
} from "@cmssy/react";
import { cmssy } from "@/cmssy/config";

const workspaceId = process.env.CMSSY_WORKSPACE_ID;
const scopeHeaders = workspaceId
  ? { "x-workspace-id": workspaceId }
  : undefined;

export async function GET(req: Request) {
  const formId = new URL(req.url).searchParams.get("formId");
  if (!formId) {
    return NextResponse.json({ form: null }, { status: 400 });
  }
  try {
    const data = await graphqlRequest<{
      publicForm: CmssyFormDefinition | null;
    }>(
      { apiUrl: cmssy.apiUrl, workspaceSlug: cmssy.workspaceSlug },
      FORM_QUERY,
      { formId },
      scopeHeaders ? { headers: scopeHeaders } : undefined,
    );
    return NextResponse.json({ form: data.publicForm });
  } catch {
    return NextResponse.json({ form: null }, { status: 500 });
  }
}
