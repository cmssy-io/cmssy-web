import {
  Code,
  Globe,
  Heart,
  type LucideIcon,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import type { aboutProps } from "./block";

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  heart: Heart,
  users: Users,
  zap: Zap,
  globe: Globe,
  code: Code,
  shield: ShieldCheck,
  rocket: Rocket,
};

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface TechItem {
  name: string;
  category: string;
}

export default function About({ content }: BlockProps<typeof aboutProps>) {
  const {
    badgeText,
    heading,
    headingHighlight,
    subtitle,
    missionHeading,
    missionText,
    valuesHeading,
    values = [],
    techStackHeading,
    showTechStack = true,
    techStack = [],
  } = content;

  return (
    <section className="bg-background py-section text-foreground">
      <Container>
        <div className="flex flex-col items-start gap-4">
          {badgeText && (
            <Reveal>
              <FigEyebrow fig="" label={badgeText} />
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
          {subtitle && (
            <Reveal index={2}>
              <p className="max-w-[62ch] text-lead text-muted-foreground">
                {subtitle}
              </p>
            </Reveal>
          )}
        </div>

        {missionText && (
          <Reveal className="mt-16 grid gap-6 border-t border-border pt-10 lg:grid-cols-[1fr_2fr] lg:gap-12">
            {missionHeading && (
              <h2 className="font-heading text-h3 font-semibold">
                {missionHeading}
              </h2>
            )}
            <p className="max-w-[62ch] text-lead text-muted-foreground lg:col-start-2">
              {missionText}
            </p>
          </Reveal>
        )}

        {(values as Value[]).length > 0 && (
          <div className="mt-16">
            {valuesHeading && (
              <h2 className="font-heading text-h2 font-semibold text-balance">
                {valuesHeading}
              </h2>
            )}
            <div
              className={`grid gap-6 md:grid-cols-2 ${valuesHeading ? "mt-10" : ""}`}
            >
              {(values as Value[]).map((value, index) => {
                const IconComponent = iconMap[value.icon] || Sparkles;
                return (
                  <Reveal
                    key={index}
                    index={index}
                    className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-[30px]"
                  >
                    <IconComponent
                      className="size-5 text-elektryk"
                      aria-hidden="true"
                    />
                    <h3 className="mt-4 font-heading text-h3 font-semibold">
                      {value.title}
                    </h3>
                    <p className="mt-2.5 text-copy leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}

        {showTechStack && (techStack as TechItem[]).length > 0 && (
          <div className="mt-16">
            {techStackHeading && (
              <h2 className="font-heading text-h2 font-semibold text-balance">
                {techStackHeading}
              </h2>
            )}
            <div
              className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${
                techStackHeading ? "mt-10" : ""
              }`}
            >
              {(techStack as TechItem[]).map((tech, index) => (
                <div
                  key={index}
                  className="min-w-0 rounded-xl border border-border bg-card p-5"
                >
                  <p className="font-heading text-copy font-semibold">
                    {tech.name}
                  </p>
                  {tech.category && (
                    <p className="mt-1 font-mono text-caption text-muted-foreground">
                      {tech.category}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
