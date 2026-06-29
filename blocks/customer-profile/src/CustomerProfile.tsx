"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { CmssyLink } from "@cmssy/next/client";
import { BlockContent } from "./block";
import type { PlatformContext } from "@cmssy/types";

const UPDATE_PROFILE_MUTATION = `
  mutation SiteMemberUpdateProfile($input: SiteMemberProfileInput!) {
    siteMemberUpdateProfile(input: $input) {
      success
      message
      member {
        id
        email
        profile {
          firstName
          lastName
          displayName
          avatarUrl
          phone
        }
      }
    }
  }
`;

interface GraphQLResponse {
  data?: {
    siteMemberUpdateProfile?: {
      success: boolean;
      message: string;
      member?: {
        id: string;
        email: string;
        profile?: {
          firstName?: string;
          lastName?: string;
          displayName?: string;
          avatarUrl?: string;
          phone?: string;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function CustomerProfile({
  content,
  context,
}: {
  content: BlockContent;
  context?: PlatformContext;
}) {
  const {
    heading = "Your Profile",
    description = "Manage your account information.",
    firstNameLabel = "First name",
    lastNameLabel = "Last name",
    displayNameLabel = "Display name",
    displayNameHelpText = "This is how your name will appear publicly",
    phoneLabel = "Phone number",
    showAvatarUpload = true,
    showPhoneField = true,
    firstNamePlaceholder = "First name",
    lastNamePlaceholder = "Last name",
    displayNamePlaceholder = "Display name (public)",
    phonePlaceholder = "+1 (555) 123-4567",
    saveButtonText = "Save changes",
    submitLoadingText = "Saving...",
    showLogoutButton = true,
    logoutButtonText = "Sign out",
    logoutRedirectUrl = "/",
    successMessage = "Profile updated successfully!",
    errorMessage = "Failed to update profile. Please try again.",
    notLoggedInMessage = "Please log in to view your profile.",
    loginUrl = "/login",
    loginButtonText = "Sign in",
    variant = "default",
  } = content;

  const isAuthenticated = context?.auth?.isAuthenticated ?? false;
  const member = context?.auth?.member;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState(member?.profile?.firstName || "");
  const [lastName, setLastName] = useState(member?.profile?.lastName || "");
  const [displayName, setDisplayName] = useState(
    member?.profile?.displayName || "",
  );
  const [phone, setPhone] = useState(member?.profile?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(member?.profile?.avatarUrl || "");

  // Update form when member data changes
  useEffect(() => {
    if (member?.profile) {
      setFirstName(member.profile.firstName || "");
      setLastName(member.profile.lastName || "");
      setDisplayName(member.profile.displayName || "");
      setPhone(member.profile.phone || "");
      setAvatarUrl(member.profile.avatarUrl || "");
    }
  }, [member]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      setShowSuccess(false);

      // Demo mode
      if (!context?.auth?.isAuthenticated) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowSuccess(true);
        setIsSubmitting(false);
        setTimeout(() => setShowSuccess(false), 3000);
        return;
      }

      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: UPDATE_PROFILE_MUTATION,
            variables: {
              input: {
                firstName: firstName || null,
                lastName: lastName || null,
                displayName: displayName || null,
                phone: showPhoneField ? phone || null : undefined,
                avatarUrl: showAvatarUpload ? avatarUrl || null : undefined,
              },
            },
          }),
        });

        const result: GraphQLResponse = await response.json();

        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0].message);
        } else if (result.data?.siteMemberUpdateProfile?.success) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          setError(
            result.data?.siteMemberUpdateProfile?.message || errorMessage,
          );
        }
      } catch {
        setError(errorMessage);
      }

      setIsSubmitting(false);
    },
    [
      context?.auth?.isAuthenticated,
      firstName,
      lastName,
      displayName,
      phone,
      avatarUrl,
      showPhoneField,
      showAvatarUpload,
      errorMessage,
    ],
  );

  const handleLogout = useCallback(async () => {
    if (context?.auth?.logout) {
      await context.auth.logout();
    }
    // Clear stored tokens
    localStorage.removeItem("site_customer_token");
    localStorage.removeItem("site_customer_token_expires");
    sessionStorage.removeItem("site_customer_token");
    window.location.href = logoutRedirectUrl;
  }, [context?.auth, logoutRedirectUrl]);

  const isCard = variant === "card";

  // Not logged in state
  if (!isAuthenticated && !context?.isPreview) {
    return (
      <section
        className={`py-12 lg:py-16 ${
          isCard
            ? "bg-linear-to-br from-slate-50 via-background to-blue-50"
            : ""
        }`}
      >
        <div className="max-w-md mx-auto px-4">
          <div
            className={
              isCard
                ? "bg-card/80 backdrop-blur-sm rounded-2xl border shadow-xl shadow-blue-500/5 p-8"
                : ""
            }
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UserIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {notLoggedInMessage}
              </h3>
              <CmssyLink
                href={loginUrl}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {loginButtonText}
              </CmssyLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Demo data for preview mode
  const displayEmail = member?.email || "demo@example.com";
  const initials =
    (firstName?.[0] || displayEmail[0])?.toUpperCase() +
    (lastName?.[0] || displayEmail[1])?.toUpperCase();

  return (
    <section
      className={`py-12 lg:py-16 ${
        isCard ? "bg-linear-to-br from-slate-50 via-background to-blue-50" : ""
      }`}
    >
      <div className="max-w-lg mx-auto px-4">
        <div
          className={
            isCard
              ? "bg-card/80 backdrop-blur-sm rounded-2xl border shadow-xl shadow-blue-500/5 p-8"
              : ""
          }
        >
          {/* Header */}
          <div className="text-center mb-6">
            {heading && (
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Avatar section */}
          {showAvatarUpload && (
            <div className="flex justify-center mb-6">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-lg"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-background shadow-lg flex items-center justify-center">
                    <span className="text-2xl font-semibold text-primary">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email (read-only) */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">{displayEmail}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success message */}
            {showSuccess && (
              <div className="rounded-md bg-green-50 border border-green-200 p-3 flex items-center gap-2 text-sm text-green-700">
                <CheckIcon className="h-4 w-4" />
                {successMessage}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center">
                {error}
              </div>
            )}

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1.5"
                >
                  {firstNameLabel}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={firstNamePlaceholder}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-1.5"
                >
                  {lastNameLabel}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={lastNamePlaceholder}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {/* Display name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium mb-1.5"
              >
                {displayNameLabel}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={displayNamePlaceholder}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {displayNameHelpText}
              </p>
            </div>

            {/* Phone */}
            {showPhoneField && (
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1.5"
                >
                  {phoneLabel}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <PhoneIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={phonePlaceholder}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            )}

            {/* Save button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? submitLoadingText : saveButtonText}
            </button>
          </form>

          {/* Logout button */}
          {showLogoutButton && (
            <div className="mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-6 w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogOutIcon className="h-4 w-4" />
                {logoutButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
