"use client";

import { useEffect, useState } from "react";
import { Container } from "../../../components/container";
import type { BlockContent } from "./block";
import { ContactForm } from "./ContactForm";
import { InfoCard } from "./InfoCard";
import type { FormDefinition } from "./query";

interface Props {
  content: BlockContent;
}

export default function Contact({ content }: Props) {
  const {
    badgeText,
    heading,
    headingHighlight,
    description,
    infoCards,
    showQuote,
    quoteText,
    quoteAuthor,
    formId,
    submitLoadingText,
    successHeading,
  } = content;

  const [formDef, setFormDef] = useState<FormDefinition | null>(null);

  useEffect(() => {
    setFormDef(null);
    if (!formId) return;
    let active = true;
    fetch(`/api/contact?formId=${encodeURIComponent(formId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (active) setFormDef((json?.form as FormDefinition) ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [formId]);

  const hasQuote = showQuote && quoteText;

  return (
    <section className="relative min-h-screen py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-background to-purple-50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20" />
      <div className="absolute top-0 right-0 w-125 h-125 bg-violet-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-purple-400/20 rounded-full blur-3xl" />

      <Container className="relative">
        {/* Header */}
        <div className="text-center mb-16">
          {badgeText && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
              {badgeText}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {heading}{" "}
            {headingHighlight && (
              <span className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                {headingHighlight}
              </span>
            )}
          </h1>
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
                <div className="p-6 rounded-2xl bg-linear-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200/50 dark:border-violet-800/30">
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;{quoteText}&rdquo;
                  </p>
                  {quoteAuthor && (
                    <p className="text-sm font-medium mt-2 bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      - {quoteAuthor}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-xl shadow-violet-500/5 p-6 sm:p-8">
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
