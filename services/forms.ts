import { print } from "graphql";
import { createCmssyClient } from "@cmssy/react";
import { cmssy } from "@/cmssy/config";
import {
  SubmitFormDocument,
  type SubmitFormMutation,
} from "@/graphql/generated/graphql";

const workspaceId =
  process.env.CMSSY_WORKSPACE_ID ?? process.env.NEXT_PUBLIC_CMSSY_WORKSPACE_ID;

const client = createCmssyClient(cmssy);

export interface FormSubmitResult {
  success: boolean;
  message: string | null;
}

export async function submitForm(
  formId: string,
  data: Record<string, string>,
): Promise<FormSubmitResult> {
  const res = await client.queryScoped<SubmitFormMutation>(
    print(SubmitFormDocument),
    { formId, input: { data } },
    { workspaceId },
  );
  const result = res.public.form.submit;
  return { success: result.success, message: result.message };
}
