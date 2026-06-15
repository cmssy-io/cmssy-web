import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CmssyLink } from "@cmssy/next/client";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";

export default function Legal({ content }: { content: BlockContent }) {
  const {
    badge = "Privacy",
    heading = "Privacy",
    headingHighlight = "Policy",
    description = "Learn how we collect, use, and protect your personal information.",
    showSummary = true,
    summaryTitle = "TL;DR",
    summaryContent = "We respect your privacy and only collect data necessary to provide our services.",
    sections = [],
    showFooterLinks = true,
    footerText = "This policy is part of our",
    footerLinks = [],
    lastUpdated = "January 2025",
  } = content;

  return (
    <section className="py-24">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          {badge && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
              {badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {heading}{" "}
            <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {headingHighlight}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Summary Box */}
          {showSummary && summaryContent && (
            <div className="bg-linear-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-6 mb-8">
              <h3 className="font-semibold mb-2 text-lg">{summaryTitle}</h3>
              <p className="text-muted-foreground">{summaryContent}</p>
            </div>
          )}

          {/* Accordion Sections */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-xl shadow-violet-500/5 p-6 sm:p-8">
            <Accordion type="single" collapsible className="w-full">
              {sections.map((section, index) => (
                <AccordionItem key={index} value={`section-${index}`}>
                  <AccordionTrigger className="text-left font-semibold py-3">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: section.content || "",
                        }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
            {showFooterLinks && footerLinks.length > 0 && (
              <p>
                {footerText}{" "}
                {footerLinks.map((link, index) => (
                  <span key={index}>
                    {index > 0 && " and "}
                    <CmssyLink
                      href={link.url}
                      className="text-violet-600 hover:text-violet-700 underline"
                    >
                      {link.text}
                    </CmssyLink>
                  </span>
                ))}
                .
              </p>
            )}
            {lastUpdated && <p>Last updated: {lastUpdated}</p>}
          </div>
        </div>
      </Container>
    </section>
  );
}
