import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { Reveal } from "@/components/motion/reveal";
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
    <section className="bg-background py-section text-foreground">
      <Container>
        <div className="flex flex-col items-start gap-4">
          {badgeText && (
            <Reveal>
              <FigEyebrow fig="" label={badgeText} />
            </Reveal>
          )}
          {(heading || headingHighlight) && (
            <Reveal index={1}>
              <h1 className="max-w-[20ch] font-heading text-display font-semibold text-balance">
                {heading}{" "}
                {headingHighlight && (
                  <span className="text-elektryk">{headingHighlight}</span>
                )}
              </h1>
            </Reveal>
          )}
          {description && (
            <Reveal index={2}>
              <p className="max-w-[62ch] text-lead text-muted-foreground">
                {description}
              </p>
            </Reveal>
          )}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="space-y-8 lg:col-span-2">
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

            {hasQuote && (
              <figure className="hidden border-t border-border pt-8 lg:block">
                <blockquote className="font-heading text-[17px] leading-relaxed text-foreground">
                  &ldquo;{quoteText}&rdquo;
                </blockquote>
                {quoteAuthor && (
                  <figcaption className="mt-3 font-mono text-[12px] text-muted-foreground">
                    - {quoteAuthor}
                  </figcaption>
                )}
              </figure>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-8">
              {formDef?.fields?.length && formId ? (
                <ContactForm
                  formDef={formDef}
                  formId={formId}
                  successHeading={successHeading ?? "Message Sent!"}
                  submitLoadingText={submitLoadingText ?? "Sending..."}
                />
              ) : (
                <p className="py-8 text-center text-muted-foreground">
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
