import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import type { BlockProps } from "@cmssy/react";
import type { featuresProps } from "./block";

export default function Features({
  content,
}: BlockProps<typeof featuresProps>) {
  const {
    fig = "",
    eyebrow = "",
    heading = "",
    headingHighlight = "",
    description = "",
    features = [],
  } = content;

  return (
    <Section
      band="wash"
      fig={fig}
      eyebrow={eyebrow}
      heading={
        <>
          {heading}
          {headingHighlight ? (
            <>
              {" "}
              <span className="text-primary">{headingHighlight}</span>
            </>
          ) : null}
        </>
      }
      lead={description}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Reveal key={feature.title} index={i}>
            <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-elektryk/40">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-ink" />
                <span className="size-2.5 rounded-[3px] bg-ink" />
                <span className="size-2.5 rounded-[3px] bg-elektryk" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
              {feature.stat ? (
                <div className="mt-4 font-mono text-caption font-medium text-primary">
                  {feature.stat}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
