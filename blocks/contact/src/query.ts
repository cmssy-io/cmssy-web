export interface FormField {
  id: string;
  name: string;
  fieldType: string;
  label: Record<string, string> | string | null;
  placeholder: Record<string, string> | string | null;
  helpText: Record<string, string> | string | null;
  validation: {
    required?: boolean;
    minLength?: number | null;
    maxLength?: number | null;
  } | null;
  width: string;
  order: number;
}

export interface FormDefinition {
  id: string;
  name: string;
  fields: FormField[];
  settings: {
    submitButtonLabel: Record<string, string> | string | null;
    successMessage: Record<string, string> | string | null;
    errorMessage: Record<string, string> | string | null;
  };
}

export type ContactStatus = "idle" | "success" | "error";

export interface ContactState {
  status: ContactStatus;
  message: string | null;
}
