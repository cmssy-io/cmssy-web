"use client";

import { useCallback, useState } from "react";
import type { ContactSubmitResponse, FormDefinition } from "./query";

function getLocalized(
  field: Record<string, string> | string | null | undefined,
  fallback = "",
): string {
  if (!field) return fallback;
  if (typeof field === "string") return field;
  return field["en"] || Object.values(field)[0] || fallback;
}

export function useContactForm(
  formId: string | undefined,
  formDef: FormDefinition | null,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const website = formData.get("website") as string;
      if (website) {
        setIsSubmitting(false);
        return;
      }

      if (!formId) {
        setError("Form not configured");
        setIsSubmitting(false);
        return;
      }

      const data: Record<string, string> = {};
      if (formDef?.fields) {
        for (const field of formDef.fields) {
          const value = formData.get(field.name) as string;
          if (value) data[field.name] = value;
        }
      }

      const errorMsg = getLocalized(
        formDef?.settings?.errorMessage,
        "Something went wrong. Please try again.",
      );

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formId, data, website: null }),
        });

        const result = (await response.json()) as ContactSubmitResponse;

        if (response.ok && result.success) {
          setIsSuccess(true);
          form.reset();
        } else {
          setError(result.message || errorMsg);
        }
      } catch {
        setError(errorMsg);
      }

      setIsSubmitting(false);
    },
    [formId, formDef],
  );

  return {
    isSubmitting,
    isSuccess,
    error,
    handleSubmit,
    getLocalized,
  };
}
