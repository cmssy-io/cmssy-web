"use client";

import { useActionState } from "react";
import type { CmssyFormDefinition } from "@cmssy/react";
import { submitContact } from "./actions";
import type { ContactState } from "./types";
import { SuccessMessage } from "./SuccessMessage";

const inputClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

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
    return o["en"] || Object.values(o)[0] || fallback;
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

  const sortedFields = [...formDef.fields].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <form action={formAction} className="space-y-6">
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
        >
          {errorMessage}
        </div>
      )}

      {sortedFields.map((field) => {
        const validation = (field.validation as FieldValidation | null) ?? null;
        const label = getLocalized(field.label, field.name);
        const placeholder = getLocalized(field.placeholder);
        const helpText = getLocalized(field.helpText);
        const isRequired = validation?.required ?? false;
        const isTextarea =
          field.fieldType === "textarea" || field.fieldType === "multiLine";
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
        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 transition-colors"
      >
        {isPending ? submitLoadingText : submitButtonText}
      </button>
    </form>
  );
}
