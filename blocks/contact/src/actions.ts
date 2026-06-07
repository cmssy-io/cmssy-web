"use server";

import {
  createCmssyClient,
  SUBMIT_FORM_MUTATION,
  type CmssyFormSubmitResponse,
} from "@cmssy/react";
import { cmssy } from "@/cmssy/config";
import type { ContactState } from "./query";

export async function submitContact(
  formId: string,
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const website = (formData.get("website") as string) || undefined;
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
    }>(
      SUBMIT_FORM_MUTATION,
      { formId, input: { data, website } },
      { workspaceId: process.env.CMSSY_WORKSPACE_ID },
    );
    const result = res.submitForm;
    return {
      status: result.success ? "success" : "error",
      message: result.message ?? null,
    };
  } catch {
    return { status: "error", message: null };
  }
}
