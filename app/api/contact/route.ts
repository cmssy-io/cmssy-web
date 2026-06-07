import { NextResponse } from "next/server";
import {
  createCmssyClient,
  graphqlRequest,
  FORM_QUERY,
  SUBMIT_FORM_MUTATION,
  type CmssyFormDefinition,
  type CmssyFormSubmitResponse,
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

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    formId?: string;
    data?: Record<string, unknown>;
    website?: string;
  } | null;

  if (!body?.formId || !body.data || typeof body.data !== "object") {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  try {
    const client = createCmssyClient({
      apiUrl: cmssy.apiUrl,
      workspaceSlug: cmssy.workspaceSlug,
    });
    const res = await client.queryScoped<{
      submitForm: CmssyFormSubmitResponse;
    }>(
      SUBMIT_FORM_MUTATION,
      {
        formId: body.formId,
        input: { data: body.data, website: body.website },
      },
      { workspaceId },
    );
    return NextResponse.json(res.submitForm);
  } catch {
    return NextResponse.json(
      { success: false, message: "Submission failed. Please try again." },
      { status: 500 },
    );
  }
}
