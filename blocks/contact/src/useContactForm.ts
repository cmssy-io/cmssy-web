"use client";

import { useCallback, useState } from "react";
import {
  type FormDefinition,
  type GraphQLResponse,
  SUBMIT_FORM_MUTATION,
} from "./query";

function getLocalized(
  field: Record<string, string> | string | null | undefined,
  fallback = "",
): string {
  if (!field) return fallback;
  if (typeof field === "string") return field;
  return field["en"] || Object.values(field)[0] || fallback;
}

/**
 * Form interaction hook for the contact block.
 *
 * `formDef` is read from `context.formDefinitions[formId]` (CMS-509)
 * and passed in by the parent block - the platform pre-fetches the
 * form schema during SSR via the declarative data-source pipeline,
 * so the hook never does its own CSR fetch. No loading state, no
 * race conditions.
 */
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

      // Honeypot
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

      // Collect data by field name
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
        const response = await fetch("/api/public-graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: SUBMIT_FORM_MUTATION,
            variables: {
              formId,
              input: { data, website: null },
            },
          }),
        });

        const result: GraphQLResponse = await response.json();

        if (result.errors?.length) {
          setError(result.errors[0].message);
        } else if (result.data?.submitForm?.success) {
          setIsSuccess(true);
          form.reset();
        } else {
          setError(result.data?.submitForm?.message || errorMsg);
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
