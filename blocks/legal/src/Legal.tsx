import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CmssyLink } from "@cmssy/next/client";
import sanitizeHtml from "sanitize-html";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";

// Server-side sanitization for CMS-authored legal HTML (stored-XSS guard).
// sanitize-html strips <script>/event handlers and blocks javascript: hrefs by default.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "strong",
    "em",
    "ul",
    "ol",
    "li",
    "a",
    "h2",
    "h3",
    "h4",
    "br",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "code",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  // Only allow safe URL schemes for links (no javascript:/data:).
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Force rel="noopener noreferrer" on links that open a new tab.
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target) {
        attribs.rel = "noopener noreferrer";
      }
      return { tagName, attribs };
    },
  },
};

export default function Legal({ content }: { content: BlockContent }) {
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
              {sections.map((section, index) => (
                <AccordionItem key={index} value={`section-${index}`}>
                  <AccordionTrigger className="text-left font-semibold py-3">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(
                            section.content || "",
                            SANITIZE_OPTIONS,
                          ),
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
