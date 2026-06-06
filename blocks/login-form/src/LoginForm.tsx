import { useState, FormEvent, useCallback } from "react";
import { BlockContent } from "./block";
import type { PlatformContext } from "@cmssy/types";

const SITE_CUSTOMER_LOGIN_MUTATION = `
  mutation SiteCustomerLogin($workspaceId: ID!, $input: SiteMemberLoginInput!) {
    siteMemberLogin(workspaceId: $workspaceId, input: $input) {
      success
      message
      accessToken
      accessTokenExpiresIn
      member {
        id
        email
      }
    }
  }
`;

interface GraphQLResponse {
  data?: {
    siteMemberLogin?: {
      success: boolean;
      message: string;
      accessToken?: string;
      accessTokenExpiresIn?: number;
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

export default function LoginForm({
  content,
  context,
}: {
  content: BlockContent;
  context?: PlatformContext;
}) {
  const {
    heading = "Welcome back",
    description = "Sign in to your account to continue.",
    emailLabel = "Email",
    emailPlaceholder = "you@example.com",
    passwordLabel = "Password",
    passwordPlaceholder = "Enter your password",
    submitButtonText = "Sign in",
    submitLoadingText = "Signing in...",
    showRememberMe = true,
    rememberMeLabel = "Remember me",
    showForgotPassword = true,
    forgotPasswordText = "Forgot your password?",
    forgotPasswordUrl = "/forgot-password",
    showRegisterLink = true,
    registerLinkText = "Don't have an account? Sign up",
    registerUrl = "/register",
    redirectAfterLogin = "/",
    successMessage = "Login successful! Redirecting...",
    errorMessage = "Invalid email or password. Please try again.",
    variant = "default",
  } = content;

  const workspaceId = context?.workspace?.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const rememberMe = formData.get("rememberMe") === "on";

      // Demo mode if no workspace
      if (!workspaceId) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSuccess(true);
        setIsSubmitting(false);
        setTimeout(() => {
          window.location.href = redirectAfterLogin;
        }, 1500);
        return;
      }

      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: SITE_CUSTOMER_LOGIN_MUTATION,
            variables: {
              workspaceId,
              input: {
                email,
                password,
              },
            },
          }),
        });

        const result: GraphQLResponse = await response.json();

        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0].message);
        } else if (result.data?.siteMemberLogin?.success) {
          // Store token in localStorage or cookie
          const token = result.data.siteMemberLogin.accessToken;
          const expiresIn = result.data.siteMemberLogin.accessTokenExpiresIn;

          if (token) {
            if (rememberMe && expiresIn) {
              // Store in localStorage for persistent login
              localStorage.setItem("site_customer_token", token);
              localStorage.setItem(
                "site_customer_token_expires",
                String(Date.now() + expiresIn * 1000),
              );
            } else {
              // Store in sessionStorage for session-only login
              sessionStorage.setItem("site_customer_token", token);
            }
          }

          setIsSuccess(true);
          setTimeout(() => {
            window.location.href = redirectAfterLogin;
          }, 1500);
        } else {
          setError(result.data?.siteMemberLogin?.message || errorMessage);
        }
      } catch {
        setError(errorMessage);
      }

      setIsSubmitting(false);
    },
    [workspaceId, redirectAfterLogin, errorMessage],
  );

  const isCard = variant === "card";

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

          {/* Success message */}
          {isSuccess && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 p-4 mb-4 text-center">
              <p className="text-green-700 dark:text-green-300">
                {successMessage}
              </p>
            </div>
          )}

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
                  disabled={isSuccess}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
              >
                {passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <LockIcon className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  placeholder={passwordPlaceholder}
                  autoComplete="current-password"
                  disabled={isSuccess}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            </div>

            {/* Remember me & Forgot password row */}
            {(showRememberMe || showForgotPassword) && (
              <div className="flex items-center justify-between">
                {showRememberMe && (
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-muted-foreground">
                      {rememberMeLabel}
                    </span>
                  </label>
                )}
                {showForgotPassword && (
                  <a
                    href={forgotPasswordUrl}
                    className="text-sm text-primary hover:underline"
                  >
                    {forgotPasswordText}
                  </a>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? submitLoadingText : submitButtonText}
            </button>
          </form>

          {/* Register link */}
          {showRegisterLink && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <a href={registerUrl} className="text-primary hover:underline">
                {registerLinkText}
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
