import { useState, FormEvent, useCallback } from "react";
import { CmssyLink } from "@cmssy/next/client";
import { BlockContent } from "./block";
import type { PlatformContext } from "@cmssy/types";

const SITE_MEMBER_REGISTER_MUTATION = `
  mutation SiteMemberRegister($workspaceId: ID!, $input: SiteMemberRegisterInput!) {
    siteMemberRegister(workspaceId: $workspaceId, input: $input) {
      success
      message
      member {
        id
        email
      }
    }
  }
`;

interface GraphQLResponse {
  data?: {
    siteMemberRegister?: {
      success: boolean;
      message: string;
      member?: {
        id: string;
        email: string;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

function MailIcon({ className }: { className?: string }) {
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
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
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

function LockIcon({ className }: { className?: string }) {
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
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
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
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
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
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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

export default function RegisterForm({
  content,
  context,
}: {
  content: BlockContent;
  context?: PlatformContext;
}) {
  const {
    heading,
    description,
    firstNameLabel,
    lastNameLabel,
    emailLabel,
    passwordLabel,
    confirmPasswordLabel,
    passwordHelpText,
    showNameFields = true,
    firstNamePlaceholder,
    lastNamePlaceholder,
    emailPlaceholder,
    passwordPlaceholder,
    confirmPasswordPlaceholder,
    submitButtonText,
    submitLoadingText,
    minPasswordLength = 8,
    termsPrefix,
    termsLinkText,
    termsConnector,
    privacyLinkText,
    showTerms = true,
    termsUrl = "/terms",
    privacyUrl = "/privacy",
    showLoginLink = true,
    loginLinkText,
    loginUrl = "/login",
    redirectAfterRegister = "/verify-email-pending",
    successHeading,
    successLoginLinkText,
    passwordTooShortMessage,
    termsRequiredMessage,
    successMessage,
    errorMessage,
    passwordMismatchMessage,
    variant = "default",
  } = content;

  const workspaceId = context?.workspace?.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      const acceptTerms = formData.get("acceptTerms") === "on";

      // Validate password match
      if (password !== confirmPassword) {
        setError(passwordMismatchMessage || null);
        setIsSubmitting(false);
        return;
      }

      // Validate password length
      if (password.length < minPasswordLength) {
        setError(
          passwordTooShortMessage
            ? passwordTooShortMessage.replace(
                "{min}",
                String(minPasswordLength),
              )
            : null,
        );
        setIsSubmitting(false);
        return;
      }

      // Validate terms acceptance
      if (showTerms && !acceptTerms) {
        setError(termsRequiredMessage || null);
        setIsSubmitting(false);
        return;
      }

      // Demo mode if no workspace
      if (!workspaceId) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSuccess(true);
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: SITE_MEMBER_REGISTER_MUTATION,
            variables: {
              workspaceId,
              input: {
                email,
                password,
                firstName: showNameFields ? firstName : null,
                lastName: showNameFields ? lastName : null,
                displayName:
                  showNameFields && firstName
                    ? `${firstName}${lastName ? ` ${lastName}` : ""}`
                    : null,
              },
            },
          }),
        });

        const result: GraphQLResponse = await response.json();

        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0].message);
        } else if (result.data?.siteMemberRegister?.success) {
          setIsSuccess(true);
          if (
            redirectAfterRegister &&
            redirectAfterRegister !== "/verify-email-pending"
          ) {
            setTimeout(() => {
              window.location.href = redirectAfterRegister;
            }, 2000);
          }
        } else {
          setError(
            result.data?.siteMemberRegister?.message || errorMessage || null,
          );
        }
      } catch {
        setError(errorMessage || null);
      }

      setIsSubmitting(false);
    },
    [
      workspaceId,
      showNameFields,
      showTerms,
      minPasswordLength,
      redirectAfterRegister,
      errorMessage,
      passwordMismatchMessage,
      passwordTooShortMessage,
      termsRequiredMessage,
    ],
  );

  const isCard = variant === "card";

  if (isSuccess) {
    return (
      <section
        className={`py-12 lg:py-16 ${
          isCard
            ? "bg-linear-to-br from-green-50 via-background to-emerald-50"
            : ""
        }`}
      >
        <div className="max-w-md mx-auto px-4">
          <div
            className={
              isCard
                ? "bg-card/80 backdrop-blur-sm rounded-2xl border shadow-xl shadow-green-500/5 p-8"
                : ""
            }
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              {successHeading && (
                <h3 className="text-lg font-semibold mb-2">{successHeading}</h3>
              )}
              {successMessage && (
                <p className="text-muted-foreground">{successMessage}</p>
              )}
              {showLoginLink && successLoginLinkText && (
                <CmssyLink
                  href={loginUrl}
                  className="inline-block mt-4 text-primary hover:underline"
                >
                  {successLoginLinkText}
                </CmssyLink>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-12 lg:py-16 ${
        isCard ? "bg-linear-to-br from-slate-50 via-background to-blue-50" : ""
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center">
                {error}
              </div>
            )}

            {/* Name fields */}
            {showNameFields && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  {firstNameLabel && (
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-1.5"
                    >
                      {firstNameLabel}
                    </label>
                  )}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder={firstNamePlaceholder}
                      autoComplete="given-name"
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
                <div>
                  {lastNameLabel && (
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-1.5"
                    >
                      {lastNameLabel}
                    </label>
                  )}
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder={lastNamePlaceholder}
                    autoComplete="family-name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              {emailLabel && (
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5"
                >
                  {emailLabel}
                </label>
              )}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <MailIcon className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder={emailPlaceholder}
                  autoComplete="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              {passwordLabel && (
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1.5"
                >
                  {passwordLabel}
                </label>
              )}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <LockIcon className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  minLength={minPasswordLength}
                  placeholder={passwordPlaceholder}
                  autoComplete="new-password"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordHelpText && (
                <p className="text-xs text-muted-foreground mt-1">
                  {passwordHelpText.replace("{min}", String(minPasswordLength))}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              {confirmPasswordLabel && (
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1.5"
                >
                  {confirmPasswordLabel}
                </label>
              )}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <LockIcon className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder={confirmPasswordPlaceholder}
                  autoComplete="new-password"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            {showTerms && (
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  className="h-4 w-4 mt-0.5 rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-muted-foreground">
                  {termsPrefix && <>{termsPrefix} </>}
                  {termsLinkText && (
                    <CmssyLink
                      href={termsUrl}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {termsLinkText}
                    </CmssyLink>
                  )}
                  {termsConnector && <> {termsConnector} </>}
                  {privacyLinkText && (
                    <CmssyLink
                      href={privacyUrl}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {privacyLinkText}
                    </CmssyLink>
                  )}
                </span>
              </label>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? submitLoadingText : submitButtonText}
            </button>
          </form>

          {/* Login link */}
          {showLoginLink && loginLinkText && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <CmssyLink
                href={loginUrl}
                className="text-primary hover:underline"
              >
                {loginLinkText}
              </CmssyLink>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
