"use client";

import { useActionState, useState } from "react";
import type { CmssyFormDefinition } from "@cmssy/react";
import { isFormFieldRequired, visibleFormFields } from "@cmssy/react";
import { submitContact } from "./actions";
import type { ContactState } from "./types";
import { SuccessMessage } from "./SuccessMessage";

const inputClassName =
  "flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors ring-offset-background placeholder:text-muted-foreground focus-visible:border-elektryk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elektryk/30";

const INITIAL_STATE: ContactState = { status: "idle", message: null };

interface FieldValidation {
  required?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
}

function getLocalized(field: unknown, fallback = ""): string {
  if (!field) return fallback;
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    const o = field as Record<string, string>;
    return Object.values(o)[0] || fallback;
  }
  return fallback;
}

interface ContactFormProps {
  formDef: CmssyFormDefinition;
  formId: string;
  successHeading: string;
  submitLoadingText: string;
}

export function ContactForm({
  formDef,
  formId,
  successHeading,
  submitLoadingText,
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitContact.bind(null, formId),
    INITIAL_STATE,
  );
  const [fieldValues, setFieldValues] = useState<Record<string, unknown>>({});

  const submitButtonText = getLocalized(
    formDef.settings?.submitButtonLabel,
    "Send Message",
  );

  if (state.status === "success") {
    return (
      <SuccessMessage
        heading={successHeading}
        message={getLocalized(
          formDef.settings?.successMessage,
          "Thank you! Your message has been sent.",
        )}
      />
    );
  }

  const errorMessage =
    state.message ||
    getLocalized(
      formDef.settings?.errorMessage,
      "Something went wrong. Please try again.",
    );

  const sortedFields = visibleFormFields(
    [...formDef.fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    fieldValues,
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
      onChange={(event) =>
        setFieldValues(
          Object.fromEntries(new FormData(event.currentTarget).entries()),
        )
      }
    >
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {errorMessage}
        </div>
      )}

      {sortedFields.map((field) => {
        const validation = (field.validation as FieldValidation | null) ?? null;
        const label = getLocalized(field.label, field.name);
        const placeholder = getLocalized(field.placeholder);
        const helpText = getLocalized(field.helpText);
        const isRequired = isFormFieldRequired(field, fieldValues);
        const isTextarea = field.fieldType === "textarea";
        const inputType =
          field.fieldType === "email"
            ? "email"
            : field.fieldType === "phone"
              ? "tel"
              : field.fieldType === "url"
                ? "url"
                : field.fieldType === "number"
                  ? "number"
                  : "text";

        return (
          <div
            key={field.id}
            className={
              field.width === "half"
                ? "inline-block w-[calc(50%-0.5rem)] align-top mr-4 last:mr-0"
                : ""
            }
          >
            <div className="space-y-2">
              <label
                htmlFor={field.name}
                className="text-sm font-medium leading-none"
              >
                {label}
                {isRequired && <span className="text-destructive ml-1">*</span>}
              </label>

              {isTextarea ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  required={isRequired}
                  placeholder={placeholder}
                  rows={5}
                  minLength={validation?.minLength ?? undefined}
                  maxLength={validation?.maxLength ?? undefined}
                  className={`${inputClassName} min-h-20`}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={inputType}
                  required={isRequired}
                  placeholder={placeholder}
                  minLength={validation?.minLength ?? undefined}
                  maxLength={validation?.maxLength ?? undefined}
                  className={inputClassName}
                />
              )}

              {helpText && (
                <p className="text-xs text-muted-foreground">{helpText}</p>
              )}
            </div>
          </div>
        );
      })}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-lg bg-elektryk px-6 py-3 font-semibold text-ink transition-colors hover:bg-elektryk/85 disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? submitLoadingText : submitButtonText}
      </button>
    </form>
  );
}
