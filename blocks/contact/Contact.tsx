import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import type { contactProps } from "./block";
import { ContactForm } from "./ContactForm";
import { InfoCard } from "./InfoCard";

export default function Contact({
  content,
  context,
  advanced = {},
}: BlockProps<typeof contactProps>) {
  const {
    badgeText,
    heading,
    headingHighlight,
    description,
    infoCards,
    showQuote,
    quoteText,
    quoteAuthor,
    submitLoadingText,
    successHeading,
  } = content;
  const { formId } = advanced as { formId?: string };

  const formDef = formId ? (context?.forms?.[formId] ?? null) : null;

  const hasQuote = showQuote && quoteText;

  return (
    <section className="relative min-h-screen py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-sky-50 via-background to-blue-50" />
      <div className="absolute top-0 right-0 w-125 h-125 bg-sky-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-400/20 rounded-full blur-3xl" />

      <Container className="relative">
        {/* Header */}
        <div className="text-center mb-16">
          {badgeText && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-medium mb-6">
              {badgeText}
            </span>
          )}
          {(heading || headingHighlight) && (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {heading}{" "}
              {headingHighlight && (
                <span className="bg-linear-to-r from-sky-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
                  {headingHighlight}
                </span>
              )}
            </h1>
          )}
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              {(
                infoCards as Array<{
                  icon?: string;
                  title?: string;
                  description?: string;
                }>
              ).map((card, index) => (
                <InfoCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  index={index}
                />
              ))}
            </div>

            {/* Quote */}
            {hasQuote && (
              <div className="hidden lg:block pt-8">
                <div className="p-6 rounded-2xl bg-linear-to-br from-sky-100 to-blue-100 border border-sky-200/50">
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;{quoteText}&rdquo;
                  </p>
                  {quoteAuthor && (
                    <p className="text-sm font-medium mt-2 bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                      - {quoteAuthor}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-xl shadow-sky-500/5 p-6 sm:p-8">
              {formDef?.fields?.length && formId ? (
                <ContactForm
                  formDef={formDef}
                  formId={formId}
                  successHeading={successHeading ?? "Message Sent!"}
                  submitLoadingText={submitLoadingText ?? "Sending..."}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No form configured. Select a form in block settings.
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
