export const SUBMIT_FORM_MUTATION = `
  mutation SubmitForm($formId: ID!, $input: SubmitFormInput!) {
    submitForm(formId: $formId, input: $input) {
      success
      message
    }
  }
`;

// Headless: when the platform doesn't SSR-inject the form schema, fetch it
// from the public delivery API.
export const PUBLIC_FORM_QUERY = `
  query PublicForm($formId: ID!) {
    publicForm(formId: $formId) {
      id
      name
      fields {
        id name fieldType label placeholder helpText width order
        validation { required minLength maxLength }
      }
      settings {
        submitButtonLabel successMessage errorMessage
      }
    }
  }
`;

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

export interface GraphQLResponse {
  data?: {
    submitForm?: {
      success: boolean;
      message: string;
    };
  };
  errors?: Array<{ message: string }>;
}
