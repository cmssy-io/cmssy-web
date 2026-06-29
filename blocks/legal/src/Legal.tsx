import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CmssyLink } from "@cmssy/next/client";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";

// `data.sections` holds the section HTML already sanitized server-side by the
// block loader (see block.ts). This component is client-rendered (Accordion),
// so it must NOT sanitize here - that would bundle sanitize-html into the
// client and run it in the browser. When the loader hasn't run (editor preview,
// `data` undefined), fall back to escaped text rather than injecting raw HTML.
export default function Legal({
  content,
  data,
}: {
  content: BlockContent;
  data?: { sections?: string[] };
}) {
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
    <section className="py-24">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          {badge && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
              {badge}
            </span>
          )}
          {(heading || headingHighlight) && (
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {heading}{" "}
              {headingHighlight && (
                <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {headingHighlight}
                </span>
              )}
            </h2>
          )}
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Summary Box */}
          {showSummary && summaryContent && (
            <div className="bg-linear-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-200 p-6 mb-8">
              {summaryTitle && (
                <h3 className="font-semibold mb-2 text-lg">{summaryTitle}</h3>
              )}
              <p className="text-muted-foreground">{summaryContent}</p>
            </div>
          )}

          {/* Accordion Sections */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-xl shadow-violet-500/5 p-6 sm:p-8">
            <Accordion type="single" collapsible className="w-full">
              {sections.map((section, index) => {
                const safeHtml = data?.sections?.[index];
                return (
                  <AccordionItem key={index} value={`section-${index}`}>
                    <AccordionTrigger className="text-left font-semibold py-3">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none text-muted-foreground">
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

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
            {showFooterLinks && footerLinks.length > 0 && (
              <p>
                {footerText && <>{footerText} </>}
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
