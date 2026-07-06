// Auto-generated from config.ts
// DO NOT EDIT - This file is automatically regenerated

export interface BlockContent {
  heading?: string;
  description?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  emailLabel?: string;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  /** Use {min} for minimum length */
  passwordHelpText?: string;
  showNameFields?: boolean;
  firstNamePlaceholder?: string;
  lastNamePlaceholder?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
  submitButtonText?: string;
  submitLoadingText?: string;
  termsPrefix?: string;
  termsLinkText?: string;
  termsConnector?: string;
  privacyLinkText?: string;
  showTerms?: boolean;
  termsText?: string;
  termsUrl?: string;
  privacyUrl?: string;
  showLoginLink?: boolean;
  loginLinkText?: string;
  loginUrl?: string;
  successHeading?: string;
  successLoginLinkText?: string;
  /** Use {min} for minimum length */
  passwordTooShortMessage?: string;
  termsRequiredMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  passwordMismatchMessage?: string;
}

export interface BlockStyle {
  variant?: "default" | "card";
}

export interface BlockAdvanced {
  minPasswordLength?: number;
  redirectAfterRegister?: string;
}
