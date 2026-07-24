"use server";

import { submitForm } from "@/services/forms";
import type { ContactState } from "./types";

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
    const result = await submitForm(formId, data);
    return {
      status: result.success ? "success" : "error",
      message: result.message,
    };
  } catch {
    return { status: "error", message: null };
  }
}
