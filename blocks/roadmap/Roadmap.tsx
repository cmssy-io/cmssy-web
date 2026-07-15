import {
  ArrowRight,
  CircleCheck,
  Clock,
  CircleHelp,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import type { roadmapProps } from "./block";

const statusConfig = {
  completed: {
    icon: CircleCheck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  in_progress: {
    icon: Clock,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  planned: {
    icon: Lightbulb,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  considering: {
    icon: CircleHelp,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
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
    ctaButtonUrl = "/contact",
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
                          <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full whitespace-nowrap">
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
            <div className="bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl shadow-xl shadow-violet-500/25 p-8 text-center text-white">
              <MessageSquare className="size-10 mx-auto mb-4 opacity-90" />
              {ctaTitle && (
                <h3 className="text-2xl font-bold mb-3">{ctaTitle}</h3>
              )}
              {ctaDescription && (
                <p className="text-violet-100 mb-6">{ctaDescription}</p>
              )}
              {ctaButtonText && (
                <CmssyLink
                  href={ctaButtonUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 font-medium rounded-lg hover:bg-violet-50 transition-colors"
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
