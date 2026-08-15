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
import { Reveal } from "@/components/motion/reveal";
import type { faqProps } from "./block";

export default function Faq({ content }: BlockProps<typeof faqProps>) {
  const {
    fig = "",
    eyebrow = "",
    heading = "",
    headingHighlight = "",
    description = "",
    faqs = [],
  } = content;

  return (
    <section id="faq" className="bg-background py-section">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <FigEyebrow fig={fig} label={eyebrow} />
            </Reveal>
            {heading || headingHighlight ? (
              <Reveal index={1}>
                <h2 className="mt-5 font-heading text-h2 font-semibold text-foreground text-balance">
                  {heading}
                  {headingHighlight ? (
                    <>
                      {" "}
                      <span className="text-elektryk-700">
                        {headingHighlight}
                      </span>
                    </>
                  ) : null}
                </h2>
              </Reveal>
            ) : null}
            {description ? (
              <Reveal index={2}>
                <p className="mt-4 text-lead text-muted-foreground">
                  {description}
                </p>
              </Reveal>
            ) : null}
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => {
              const question =
                typeof faq.data.question === "string" ? faq.data.question : "";
              const answer =
                typeof faq.data.answer === "string" ? faq.data.answer : "";
              if (!question) return null;
              return (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-xl border border-border bg-card px-6 last:border-b data-[state=open]:shadow-[-.35rem_.35rem_0_rgba(0,168,240,.1)] transition-shadow"
                >
                  <AccordionTrigger className="group py-5 text-left font-heading font-semibold text-foreground hover:no-underline [&>svg]:hidden">
                    <span className="flex-1">{question}</span>
                    <span className="relative mt-1 size-4 shrink-0" aria-hidden>
                      <span className="absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2 rounded-full bg-elektryk-700" />
                      <span className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 rounded-full bg-elektryk-700 transition-transform duration-200 group-data-[state=open]:scale-y-0" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-muted-foreground">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
