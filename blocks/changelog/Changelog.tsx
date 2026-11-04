import { Bug, Rss, Sparkles, Zap } from "lucide-react";
import { CmssyLink } from "@/components/cmssy-locale";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import type { changelogProps } from "./block";

const typeConfig = {
  feature: {
    icon: Sparkles,
    label: "New Feature",
  },
  improvement: {
    icon: Zap,
    label: "Improvement",
  },
  bugfix: {
    icon: Bug,
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
    subscribeButtonUrl,
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

          {showSubscribe && (
            <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Rss className="size-5 text-elektryk" />
                {subscribeText && (
                  <span className="text-sm">{subscribeText}</span>
                )}
              </div>
              {subscribeButtonText && subscribeButtonUrl && (
                <CmssyLink
                  href={subscribeButtonUrl}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {subscribeButtonText}
                </CmssyLink>
              )}
            </div>
          )}

          <ol className="mt-16">
            {entries.map((entry, index) => {
              const config =
                typeConfig[entry.type as keyof typeof typeConfig] ||
                typeConfig.feature;
              const Icon = config.icon;

              return (
                <li
                  key={index}
                  className="relative border-l border-border pb-10 pl-8 last:border-transparent last:pb-0"
                >
                  <span className="absolute top-1.5 -left-[5px] size-2.5 rounded-[3px] bg-elektryk" />

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-mono text-sm font-semibold">
                      v{entry.version}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      <Icon className="size-3" />
                      {config.label}
                    </span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {entry.date}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-lg font-semibold">
                      {entry.title}
                    </h2>
                    <ul className="mt-3 space-y-2">
                      {(entry.changes || []).map((change, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-2 inline-block size-1.5 shrink-0 rounded-[2px] bg-border" />
                          {change.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
