import { useState, FormEvent, useCallback } from "react";
import { BlockContent } from "./block";
import type { PlatformContext } from "@cmssy/types";

const REQUEST_PASSWORD_RESET_MUTATION = `
  mutation SiteMemberRequestPasswordReset($workspaceId: ID!, $email: String!) {
    siteMemberRequestPasswordReset(workspaceId: $workspaceId, email: $email) {
      success
      message
    }
  }
`;

interface GraphQLResponse {
  data?: {
    siteMemberRequestPasswordReset?: {
      success: boolean;
      message: string;
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

function ArrowLeftIcon({ className }: { className?: string }) {
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
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );
}

export default function ForgotPasswordForm({
  content,
  context,
}: {
  content: BlockContent;
  context?: PlatformContext;
}) {
  const {
    heading = "Forgot your password?",
    description = "Enter your email address and we'll send you a link to reset your password.",
    emailLabel = "Email",
    emailPlaceholder = "you@example.com",
    submitButtonText = "Send reset link",
    submitLoadingText = "Sending...",
    showLoginLink = true,
    loginLinkText = "Back to login",
    loginUrl = "/login",
    successHeading = "Check your email",
    emailSentText = "We sent an email to",
    successMessage = "If an account exists with this email, you will receive a password reset link shortly.",
    errorMessage = "Something went wrong. Please try again.",
    variant = "default",
  } = content;

  const workspaceId = context?.workspace?.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const email = formData.get("email") as string;
      setSubmittedEmail(email);

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
            query: REQUEST_PASSWORD_RESET_MUTATION,
            variables: {
              workspaceId,
              email,
            },
          }),
        });

        const result: GraphQLResponse = await response.json();

        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0].message);
        } else if (result.data?.siteMemberRequestPasswordReset?.success) {
          setIsSuccess(true);
        } else {
          // Still show success to prevent email enumeration
          setIsSuccess(true);
        }
      } catch {
        setError(errorMessage);
      }

      setIsSubmitting(false);
    },
    [workspaceId, errorMessage],
  );

  const isCard = variant === "card";

  if (isSuccess) {
    return (
      <section
        className={`py-12 lg:py-16 ${
          isCard
            ? "bg-linear-to-br from-green-50 via-background to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20"
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{successHeading}</h3>
              <p className="text-muted-foreground mb-2">{successMessage}</p>
              {submittedEmail && (
                <p className="text-sm text-muted-foreground">
                  {emailSentText}{" "}
                  <span className="font-medium text-foreground">
                    {submittedEmail}
                  </span>
                </p>
              )}
              {showLoginLink && (
                <a
                  href={loginUrl}
                  className="inline-flex items-center gap-2 mt-6 text-primary hover:underline"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  {loginLinkText}
                </a>
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
        isCard
          ? "bg-linear-to-br from-slate-50 via-background to-blue-50 dark:from-slate-950/20 dark:via-background dark:to-blue-950/20"
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

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
              >
                {emailLabel}
              </label>
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
          {showLoginLink && (
            <p className="mt-6 text-center">
              <a
                href={loginUrl}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                {loginLinkText}
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
