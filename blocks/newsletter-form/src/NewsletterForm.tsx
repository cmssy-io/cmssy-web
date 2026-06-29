import { useState, FormEvent, useCallback } from "react";
import { BlockContent } from "./block";
import type { PlatformContext } from "@cmssy/types";

// GraphQL mutation for newsletter subscription
const SUBSCRIBE_NEWSLETTER_MUTATION = `
  mutation SubscribeToNewsletter($workspaceId: ID!, $input: NewsletterSubscribeInput!) {
    subscribeToNewsletter(workspaceId: $workspaceId, input: $input) {
      success
      message
    }
  }
`;

interface GraphQLResponse {
  data?: {
    subscribeToNewsletter?: {
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

export default function NewsletterForm({
  content,
  context,
}: {
  content: BlockContent;
  context?: PlatformContext;
}) {
  const {
    heading = "Stay in the loop",
    description = "Get the latest updates delivered straight to your inbox.",
    showNameField = false,
    namePlaceholder = "Your name",
    emailPlaceholder = "you@example.com",
    submitButtonText = "Subscribe",
    submitLoadingText = "Subscribing...",
    tags = [],
    successHeading = "You're subscribed!",
    successMessage = "Thanks for subscribing!",
    errorMessage = "Something went wrong. Please try again.",
    variant = "inline",
    showPrivacyNote = true,
    privacyNote = "We respect your privacy. Unsubscribe at any time.",
  } = content;

  const workspaceId = context?.workspace?.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const email = formData.get("email") as string;
      const name = showNameField ? (formData.get("name") as string) : null;
      const honeypot = formData.get("website") as string;

      // Extract tags from repeater format
      const tagValues = (tags || [])
        .map((t: { tag?: string }) => t.tag)
        .filter((t): t is string => !!t);

      // Demo mode if no workspace
      if (!workspaceId) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSuccess(true);
        form.reset();
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
            query: SUBSCRIBE_NEWSLETTER_MUTATION,
            variables: {
              workspaceId,
              input: {
                email,
                name: name || null,
                tags: tagValues.length > 0 ? tagValues : null,
                honeypot: honeypot || null,
              },
            },
          }),
        });

        const result: GraphQLResponse = await response.json();

        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0].message);
        } else if (result.data?.subscribeToNewsletter?.success) {
          setIsSuccess(true);
          form.reset();
        } else {
          setError(result.data?.subscribeToNewsletter?.message || errorMessage);
        }
      } catch {
        setError(errorMessage);
      }

      setIsSubmitting(false);
    },
    [workspaceId, tags, showNameField, errorMessage],
  );

  if (isSuccess) {
    return (
      <section className="py-12 lg:py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="rounded-2xl bg-green-50 border border-green-200 p-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{successHeading}</h3>
            <p className="text-muted-foreground">{successMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  const isInline = variant === "inline";
  const isCard = variant === "card";

  return (
    <section
      className={`py-12 lg:py-16 ${isCard ? "bg-linear-to-br from-violet-50 via-background to-purple-50" : ""}`}
    >
      <div className="max-w-xl mx-auto px-4">
        <div
          className={
            isCard
              ? "bg-card/80 backdrop-blur-sm rounded-2xl border shadow-xl shadow-violet-500/5 p-8"
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
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <div
              className={
                isInline && !showNameField ? "flex gap-3" : "space-y-3"
              }
            >
              {showNameField && (
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder={namePlaceholder}
                    autoComplete="name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              )}

              <div className={isInline && !showNameField ? "flex-1" : ""}>
                <div
                  className={
                    isInline && !showNameField ? "flex gap-3" : "space-y-3"
                  }
                >
                  <div
                    className={
                      isInline && !showNameField
                        ? "flex-1 relative"
                        : "relative"
                    }
                  >
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <MailIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={emailPlaceholder}
                      autoComplete="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 transition-colors ${isInline && !showNameField ? "" : "w-full"}`}
                  >
                    {isSubmitting ? submitLoadingText : submitButtonText}
                  </button>
                </div>
              </div>
            </div>

            {showPrivacyNote && privacyNote && (
              <p className="text-xs text-muted-foreground text-center">
                {privacyNote}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
