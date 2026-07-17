import type { BlockProps } from "@cmssy/react";
import { Container } from "../../components/container";
import type { docsStepsProps } from "./block";

export default function DocsSteps({ content }: BlockProps<typeof docsStepsProps>) {
  const {
    heading,
    description,
    steps = [],
    showNumbers = true,
    connectorStyle = "line",
  } = content;

  const connectorClasses = {
    line: "border-l-2 border-border",
    dashed: "border-l-2 border-dashed border-border",
    dots: "border-l-2 border-dotted border-border",
  };

  return (
    <Container as="section" className="py-6">
      {(heading || description) && (
        <div className="mb-8">
          {heading && <h2 className="text-2xl font-bold mb-2">{heading}</h2>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="relative">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="relative flex gap-6">
              {/* Timeline column */}
              <div className="flex flex-col items-center shrink-0">
                {/* Step circle */}
                <div className="relative z-10 flex items-center justify-center size-8 rounded-full bg-sky-100 text-sky-600 border-2 border-sky-200 font-semibold text-sm">
                  {showNumbers ? (
                    index + 1
                  ) : (
                    <div className="size-2.5 rounded-full bg-sky-500" />
                  )}
                </div>
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={`flex-1 w-0 my-2 ${connectorClasses[connectorStyle]}`}
                  />
                )}
              </div>

              {/* Content column */}
              <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-8"}`}>
                <h3 className="font-semibold text-lg mb-2 pt-0.5">
                  {step.title}
                </h3>
                {step.content && (
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground
                      prose-p:my-2 prose-p:leading-relaxed
                      prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800
                      prose-code:text-xs
                      prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                      prose-ul:my-2 prose-li:my-0
                      prose-img:rounded-lg prose-img:border prose-img:border-border
                    "
                    dangerouslySetInnerHTML={{ __html: step.content }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
