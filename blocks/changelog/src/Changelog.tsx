import type { BlockProps } from "@cmssy/react";
import { Bug, Rss, Sparkles, Zap } from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
import { Container } from "../../../components/container";
import type { changelogProps } from "../block";

const typeConfig = {
  feature: {
    icon: Sparkles,
    color: "bg-emerald-100 text-emerald-700",
    label: "New Feature",
  },
  improvement: {
    icon: Zap,
    color: "bg-blue-100 text-blue-700",
    label: "Improvement",
  },
  bugfix: {
    icon: Bug,
    color: "bg-amber-100 text-amber-700",
    label: "Bug Fix",
  },
};

export default function Changelog({
  content,
}: BlockProps<typeof changelogProps>) {
  const {
    badge,
    heading,
    headingHighlight,
    description,
    entries = [],
    showSubscribe = true,
    subscribeText,
    subscribeButtonText,
    subscribeButtonUrl = "/blog",
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

        {/* Subscribe CTA */}
        {showSubscribe && (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-xl shadow-violet-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Rss className="w-5 h-5 text-violet-600" />
                {subscribeText && (
                  <span className="text-sm">{subscribeText}</span>
                )}
              </div>
              {subscribeButtonText && (
                <CmssyLink
                  href={subscribeButtonUrl}
                  className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-accent transition-colors"
                >
                  {subscribeButtonText}
                </CmssyLink>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {entries.map((entry, index) => {
              const config =
                typeConfig[entry.type as keyof typeof typeConfig] ||
                typeConfig.feature;
              const Icon = config.icon;

              return (
                <div
                  key={index}
                  className="relative pl-8 pb-8 border-l-2 border-violet-200 last:border-transparent last:pb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-linear-to-br from-violet-500 to-purple-600 border-4 border-background" />

                  {/* Content */}
                  <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-lg shadow-violet-500/5 p-6">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-mono font-semibold">
                        v{entry.version}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
                      >
                        <Icon className="w-3 h-3 inline-block mr-1" />
                        {config.label}
                      </span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {entry.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold mb-3">
                      {entry.title}
                    </h3>

                    {/* Changes */}
                    <ul className="space-y-2">
                      {(entry.changes || []).map((change, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-violet-500 mt-1">•</span>
                          {change.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
