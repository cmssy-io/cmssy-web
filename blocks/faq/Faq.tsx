"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { faqProps } from "./block";

export default function Faq({ content }: BlockProps<typeof faqProps>) {
  const {
    fig = "FIG 7.0",
    eyebrow = "",
    heading = "",
    headingHighlight = "",
    description = "",
    faqs = [],
  } = content;

  return (
    <section id="faq" className="bg-paper py-24">
      <Container className="max-w-3xl">
        <div className="mb-12 text-center">
          <FigEyebrow fig={fig} label={eyebrow} />
          {(heading || headingHighlight) && (
            <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-ink text-balance">
              {heading}
              {headingHighlight && (
                <>
                  {" "}
                  <span className="text-elektryk">{headingHighlight}</span>
                </>
              )}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-lg text-ink/60">{description}</p>
          )}
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl border border-ink/10 bg-white px-6 last:border-b data-[state=open]:shadow-[-.35rem_.35rem_0_rgba(0,168,240,.1)] transition-shadow"
            >
              <AccordionTrigger className="py-5 text-left font-heading font-semibold text-ink hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-ink/60">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
