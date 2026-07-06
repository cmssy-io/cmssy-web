// Auto-generated from config.ts
// DO NOT EDIT - This file is automatically regenerated

export interface BlockContent {
  heading?: string;
  description?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  displayNameLabel?: string;
  displayNameHelpText?: string;
  phoneLabel?: string;
  showAvatarUpload?: boolean;
  showPhoneField?: boolean;
  firstNamePlaceholder?: string;
  lastNamePlaceholder?: string;
  displayNamePlaceholder?: string;
  phonePlaceholder?: string;
  saveButtonText?: string;
  submitLoadingText?: string;
  showLogoutButton?: boolean;
  logoutButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
  notLoggedInMessage?: string;
  loginUrl?: string;
  loginButtonText?: string;
}

export interface BlockStyle {
  variant?: "default" | "card";
}

export interface BlockAdvanced {
  logoutRedirectUrl?: string;
}
