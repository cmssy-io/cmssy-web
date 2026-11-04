import {
  ArrowRight,
  CircleCheck,
  Clock,
  CircleHelp,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import { CmssyLink } from "@/components/cmssy-locale";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import type { roadmapProps } from "./block";

const statusConfig = {
  completed: {
    icon: CircleCheck,
    color: "text-foreground",
  },
  in_progress: {
    icon: Clock,
    color: "text-elektryk",
  },
  planned: {
    icon: Lightbulb,
    color: "text-muted-foreground",
  },
  considering: {
    icon: CircleHelp,
    color: "text-muted-foreground",
  },
};

export default function Roadmap({ content }: BlockProps<typeof roadmapProps>) {
  const {
    badge,
    heading,
    headingHighlight,
    description,
    columns = [],
    showCta = true,
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonUrl,
  } = content;

  return (
    <section className="bg-background py-section text-foreground">
      <Container>
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

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column, colIndex) => {
            const config =
              statusConfig[column.status as keyof typeof statusConfig] ||
              statusConfig.planned;
            const Icon = config.icon;

            return (
              <div key={colIndex} className="min-w-0 space-y-3">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Icon className={`size-4 ${config.color}`} />
                  <h2 className="font-heading text-base font-semibold">
                    {column.title}
                  </h2>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {(column.items || []).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {(column.items || []).map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="rounded-2xl border border-border bg-card p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        {item.badge && (
                          <span className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {showCta && (
          <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-ink p-8 text-center text-paper sm:p-10">
            <MessageSquare className="mx-auto size-6 text-elektryk" />
            {ctaTitle && (
              <h2 className="mt-4 font-heading text-h3 font-semibold text-balance">
                {ctaTitle}
              </h2>
            )}
            {ctaDescription && (
              <p className="mx-auto mt-3 max-w-[52ch] text-paper/60">
                {ctaDescription}
              </p>
            )}
            {ctaButtonText && ctaButtonUrl && (
              <CmssyLink
                href={ctaButtonUrl}
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-elektryk px-6 py-3 font-semibold text-ink transition-colors hover:bg-elektryk/85"
              >
                {ctaButtonText}
                <ArrowRight className="size-4" />
              </CmssyLink>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
