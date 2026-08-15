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
import type { roadmapProps } from "./block";

/* The tints are the palette's lightest step, so on the dark theme they turn into
   near-white pills carrying near-white text. Dark gets the same hue as a wash
   over the page instead, which keeps the four columns telling each other apart. */
const statusConfig = {
  completed: {
    icon: CircleCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-200 dark:border-emerald-500/25",
  },
  in_progress: {
    icon: Clock,
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-500/10",
    borderColor: "border-sky-200 dark:border-sky-500/25",
  },
  planned: {
    icon: Lightbulb,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-200 dark:border-amber-500/25",
  },
  considering: {
    icon: CircleHelp,
    color: "text-slate-600 dark:text-slate-300",
    bgColor: "bg-slate-50 dark:bg-slate-400/10",
    borderColor: "border-slate-200 dark:border-slate-400/25",
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
    <section className="py-24">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          {badge && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 text-sm font-medium mb-4">
              {badge}
            </span>
          )}
          {(heading || headingHighlight) && (
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {heading}{" "}
              {headingHighlight && (
                <span className="bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
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

        {/* Kanban Board */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {columns.map((column, colIndex) => {
            const config =
              statusConfig[column.status as keyof typeof statusConfig] ||
              statusConfig.planned;
            const Icon = config.icon;

            return (
              <div key={colIndex} className="space-y-4">
                {/* Column Header */}
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg ${config.bgColor} ${config.borderColor} border`}
                >
                  <Icon className={`size-5 ${config.color}`} />
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {(column.items || []).length}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {(column.items || []).map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-card/50 backdrop-blur-sm rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 rounded-full whitespace-nowrap">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">
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

        {/* Feedback CTA */}
        {showCta && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-linear-to-br from-sky-500 to-blue-600 rounded-2xl shadow-xl shadow-sky-500/25 p-8 text-center text-white">
              <MessageSquare className="size-10 mx-auto mb-4 opacity-90" />
              {ctaTitle && (
                <h3 className="text-2xl font-bold mb-3">{ctaTitle}</h3>
              )}
              {ctaDescription && (
                <p className="text-sky-100 mb-6">{ctaDescription}</p>
              )}
              {ctaButtonText && ctaButtonUrl && (
                <CmssyLink
                  href={ctaButtonUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-paper text-sky-700 font-medium rounded-lg hover:bg-wash transition-colors"
                >
                  {ctaButtonText}
                  <ArrowRight className="size-4" />
                </CmssyLink>
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
