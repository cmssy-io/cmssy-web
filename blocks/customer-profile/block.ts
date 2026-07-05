import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const customerProfileBlock = defineBlock({
  type: "customer-profile",
  category: "Account",
  label: "Customer Profile",
  description:
    "Signed-in member's account and profile panel; for an authenticated account page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{
    content: Record<string, unknown>;
  }>,
  props: {
    heading: fields.text({ label: "Heading", defaultValue: "Your Profile" }),
    description: fields.textarea({
      label: "Description",
      defaultValue: "Manage your account information.",
    }),
    firstNameLabel: fields.text({
      label: "First Name Label",
      defaultValue: "First name",
    }),
    lastNameLabel: fields.text({
      label: "Last Name Label",
      defaultValue: "Last name",
    }),
    displayNameLabel: fields.text({
      label: "Display Name Label",
      defaultValue: "Display name",
    }),
    displayNameHelpText: fields.text({
      label: "Display Name Help Text",
      defaultValue: "This is how your name will appear publicly",
    }),
    phoneLabel: fields.text({
      label: "Phone Label",
      defaultValue: "Phone number",
    }),
    showAvatarUpload: fields.boolean({
      label: "Show Avatar Upload",
      defaultValue: true,
    }),
    showPhoneField: fields.boolean({
      label: "Show Phone Field",
      defaultValue: true,
    }),
    firstNamePlaceholder: fields.text({
      label: "First Name Placeholder",
      defaultValue: "First name",
    }),
    lastNamePlaceholder: fields.text({
      label: "Last Name Placeholder",
      defaultValue: "Last name",
    }),
    displayNamePlaceholder: fields.text({
      label: "Display Name Placeholder",
      defaultValue: "Display name (public)",
    }),
    phonePlaceholder: fields.text({
      label: "Phone Placeholder",
      defaultValue: "+1 (555) 123-4567",
    }),
    saveButtonText: fields.text({
      label: "Save Button Text",
      defaultValue: "Save changes",
    }),
    submitLoadingText: fields.text({
      label: "Submit Loading Text",
      defaultValue: "Saving...",
    }),
    showLogoutButton: fields.boolean({
      label: "Show Logout Button",
      defaultValue: true,
    }),
    logoutButtonText: fields.text({
      label: "Logout Button Text",
      defaultValue: "Sign out",
    }),
    logoutRedirectUrl: fields.link({
      label: "Logout Redirect URL",
      defaultValue: "/",
      tab: "advanced",
    }),
    successMessage: fields.text({
      label: "Success Message",
      defaultValue: "Profile updated successfully!",
    }),
    errorMessage: fields.text({
      label: "Default Error Message",
      defaultValue: "Failed to update profile. Please try again.",
    }),
    notLoggedInMessage: fields.text({
      label: "Not Logged In Message",
      defaultValue: "Please log in to view your profile.",
    }),
    loginUrl: fields.link({ label: "Login URL", defaultValue: "/login" }),
    loginButtonText: fields.text({
      label: "Login Button Text",
      defaultValue: "Sign in",
    }),
    variant: fields.select({
      label: "Variant",
      defaultValue: "default",
      options: ["default", "card"],
      tab: "style",
    }),
  },
});
