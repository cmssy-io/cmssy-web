"use client";

import { useActionState, useState } from "react";
import type { CmssyFormDefinition } from "@cmssy/react";
import { isFormFieldRequired, visibleFormFields } from "@cmssy/react";
import { ChevronDown } from "lucide-react";
import { submitContact } from "./actions";
import type { ContactState } from "./types";
import { SuccessMessage } from "./SuccessMessage";

const inputClassName =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors ring-offset-background placeholder:text-muted-foreground focus-visible:border-elektryk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elektryk/30";

const FIELD_SPAN: Record<string, string> = {
  half: "sm:col-span-3",
  third: "sm:col-span-2",
};

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
      className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6"
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
          className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive sm:col-span-6"
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
        const isSelect = field.fieldType === "select";
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
            className={`space-y-2 ${FIELD_SPAN[field.width] ?? "sm:col-span-6"}`}
          >
            <label
              htmlFor={field.name}
              className="block text-sm font-medium leading-none"
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
                className={`${inputClassName} min-h-32 resize-y`}
              />
            ) : isSelect ? (
              <div className="relative">
                <select
                  id={field.name}
                  name={field.name}
                  required={isRequired}
                  defaultValue={field.defaultValue ?? ""}
                  className={`${inputClassName} h-11 appearance-none pr-10 invalid:text-muted-foreground [&>option]:text-foreground`}
                >
                  <option value="" disabled={isRequired}>
                    {placeholder}
                  </option>
                  {field.options.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {getLocalized(option.label, option.value)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={inputType}
                required={isRequired}
                placeholder={placeholder}
                minLength={validation?.minLength ?? undefined}
                maxLength={validation?.maxLength ?? undefined}
                className={`${inputClassName} h-11`}
              />
            )}

            {helpText && (
              <p className="text-xs text-muted-foreground">{helpText}</p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-lg bg-elektryk sm:col-span-6 px-6 py-3 font-semibold text-ink transition-colors hover:bg-elektryk/85 disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? submitLoadingText : submitButtonText}
      </button>
    </form>
  );
}
