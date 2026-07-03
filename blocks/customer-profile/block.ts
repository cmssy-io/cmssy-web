import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const customerProfileBlock = defineBlock({
  type: "customer-profile",
  label: "Customer Profile",
  description: "Signed-in member's account and profile panel; for an authenticated account page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Your Profile" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Manage your account information." }),
    "firstNameLabel": fields.singleLine({ label: "First Name Label", defaultValue: "First name" }),
    "lastNameLabel": fields.singleLine({ label: "Last Name Label", defaultValue: "Last name" }),
    "displayNameLabel": fields.singleLine({ label: "Display Name Label", defaultValue: "Display name" }),
    "displayNameHelpText": fields.singleLine({ label: "Display Name Help Text", defaultValue: "This is how your name will appear publicly" }),
    "phoneLabel": fields.singleLine({ label: "Phone Label", defaultValue: "Phone number" }),
    "showAvatarUpload": fields.boolean({ label: "Show Avatar Upload", defaultValue: true }),
    "showPhoneField": fields.boolean({ label: "Show Phone Field", defaultValue: true }),
    "firstNamePlaceholder": fields.singleLine({ label: "First Name Placeholder", defaultValue: "First name" }),
    "lastNamePlaceholder": fields.singleLine({ label: "Last Name Placeholder", defaultValue: "Last name" }),
    "displayNamePlaceholder": fields.singleLine({ label: "Display Name Placeholder", defaultValue: "Display name (public)" }),
    "phonePlaceholder": fields.singleLine({ label: "Phone Placeholder", defaultValue: "+1 (555) 123-4567" }),
    "saveButtonText": fields.singleLine({ label: "Save Button Text", defaultValue: "Save changes" }),
    "submitLoadingText": fields.singleLine({ label: "Submit Loading Text", defaultValue: "Saving..." }),
    "showLogoutButton": fields.boolean({ label: "Show Logout Button", defaultValue: true }),
    "logoutButtonText": fields.singleLine({ label: "Logout Button Text", defaultValue: "Sign out" }),
    "logoutRedirectUrl": fields.link({ label: "Logout Redirect URL", defaultValue: "/" }),
    "successMessage": fields.singleLine({ label: "Success Message", defaultValue: "Profile updated successfully!" }),
    "errorMessage": fields.singleLine({ label: "Default Error Message", defaultValue: "Failed to update profile. Please try again." }),
    "notLoggedInMessage": fields.singleLine({ label: "Not Logged In Message", defaultValue: "Please log in to view your profile." }),
    "loginUrl": fields.link({ label: "Login URL", defaultValue: "/login" }),
    "loginButtonText": fields.singleLine({ label: "Login Button Text", defaultValue: "Sign in" }),
    "variant": fields.select({ label: "Variant", defaultValue: "default", options: ["default","card"] })
  },
});
