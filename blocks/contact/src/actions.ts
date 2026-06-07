"use server";

import {
  createCmssyClient,
  SUBMIT_FORM_MUTATION,
  type CmssyFormSubmitResponse,
} from "@cmssy/react";
import { cmssy } from "@/cmssy/config";
import type { ContactState } from "./types";

const workspaceId =
  process.env.CMSSY_WORKSPACE_ID ?? process.env.NEXT_PUBLIC_CMSSY_WORKSPACE_ID;

export async function submitContact(
  formId: string,
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (formData.get("website")) {
    return { status: "success", message: null };
  }

  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "website") continue;
    if (typeof value === "string" && value) data[key] = value;
  }

  try {
    const client = createCmssyClient({
      apiUrl: cmssy.apiUrl,
      workspaceSlug: cmssy.workspaceSlug,
    });
    const res = await client.queryScoped<{
      submitForm: CmssyFormSubmitResponse;
    }>(SUBMIT_FORM_MUTATION, { formId, input: { data } }, { workspaceId });
    const result = res.submitForm;
    return {
      status: result.success ? "success" : "error",
      message: result.message ?? null,
    };
  } catch {
    return { status: "error", message: null };
  }
}
