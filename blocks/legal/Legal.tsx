"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CmssyLink } from "@/components/cmssy-locale";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import type { BlockProps } from "@cmssy/react";
import type { legalProps } from "./block";

// `data.sections` holds the section HTML already sanitized server-side by the
// block loader (see block.ts). This component is client-rendered (Accordion),
// so it must NOT sanitize here - that would bundle sanitize-html into the
// client and run it in the browser. When the loader hasn't run (editor preview,
// `data` undefined), fall back to escaped text rather than injecting raw HTML.
export default function Legal({
  content,
  data,
}: BlockProps<typeof legalProps, { sections?: string[] }>) {
  const {
    badge,
    heading,
    headingHighlight,
    description,
    showSummary = true,
    summaryTitle,
    summaryContent,
    sections = [],
    showFooterLinks = true,
    footerText,
    footerLinks = [],
    lastUpdated,
  } = content;

  return (
    <section className="bg-background py-section text-foreground">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-start gap-4">
            {badge && (
              <Reveal>
                <FigEyebrow fig="" label={badge} />
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

          {showSummary && summaryContent && (
            <div className="mt-12 rounded-2xl border border-border bg-muted p-6">
              {summaryTitle && (
                <h2 className="font-heading text-lg font-semibold">
                  {summaryTitle}
                </h2>
              )}
              <p className="mt-2 max-w-[70ch] leading-relaxed text-muted-foreground">
                {summaryContent}
              </p>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-border bg-card px-6 sm:px-8">
            <Accordion type="single" collapsible className="w-full">
              {sections.map((section, index) => {
                const safeHtml = data?.sections?.[index];
                return (
                  <AccordionItem key={index} value={`section-${index}`}>
                    <AccordionTrigger className="py-4 text-left font-heading font-semibold">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-[70ch] text-muted-foreground">
                        {safeHtml !== undefined ? (
                          <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
                        ) : (
                          <p className="whitespace-pre-wrap">
                            {section.content}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            {showFooterLinks && footerLinks.length > 0 && (
              <p>
                {footerText && <>{footerText} </>}
                {footerLinks.map((link, index) => (
                  <span key={index}>
                    {index > 0 && " and "}
                    <CmssyLink
                      href={link.url}
                      className="text-foreground underline underline-offset-4 transition-colors hover:text-elektryk"
                    >
                      {link.text}
                    </CmssyLink>
                  </span>
                ))}
                .
              </p>
            )}
            {lastUpdated && (
              <p className="font-mono text-xs">Last updated: {lastUpdated}</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
