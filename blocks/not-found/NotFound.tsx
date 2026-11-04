import { ArrowRight } from "lucide-react";
import { CmssyLink } from "@/components/cmssy-locale";
import { Container } from "@/components/container";
import type { BlockProps } from "@cmssy/react";
import type { notFoundProps } from "./block";

export default function NotFound({
  content,
}: BlockProps<typeof notFoundProps>) {
  const {
    heading,
    title,
    description,
    primaryButtonText,
    primaryButtonUrl,
    secondaryButtonText,
    secondaryButtonUrl,
  } = content;

  return (
    <section className="flex min-h-[80vh] items-center bg-background py-section">
      <Container className="max-w-3xl text-center">
        {heading && (
          <div className="select-none" aria-hidden="true">
            <span className="font-mono text-numeral font-semibold text-foreground">
              {heading}
            </span>
          </div>
        )}

        {title && (
          <h1 className="mt-6 font-heading text-h2 font-semibold text-balance">
            {title}
          </h1>
        )}

        {description && (
          <p className="mx-auto mt-5 max-w-xl text-lead text-muted-foreground">
            {description}
          </p>
        )}

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          {primaryButtonText && primaryButtonUrl && (
            <CmssyLink
              href={primaryButtonUrl}
              className="rounded-lg bg-elektryk px-6 py-3 font-semibold text-ink transition-colors hover:bg-elektryk/85"
            >
              {primaryButtonText}
            </CmssyLink>
          )}
          {secondaryButtonText && secondaryButtonUrl && (
            <CmssyLink
              href={secondaryButtonUrl}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:border-foreground/30"
            >
              {secondaryButtonText}
              <ArrowRight className="size-4" />
            </CmssyLink>
          )}
        </div>
      </Container>
    </section>
  );
}
