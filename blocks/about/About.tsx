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
    <section className="relative min-h-screen py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-background to-purple-50" />
      <div className="absolute top-0 right-0 w-125 h-125 bg-violet-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-purple-400/20 rounded-full blur-3xl" />

      <Container className="relative">
        {/* Header */}
        <div className="text-center mb-16">
          {badgeText && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              {badgeText}
            </span>
          )}
          {(heading || headingHighlight) && (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {heading}{" "}
              {headingHighlight && (
                <span className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  {headingHighlight}
                </span>
              )}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mission Section */}
        {missionText && (
          <div className="max-w-3xl mx-auto mb-20">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-xl shadow-violet-500/5 p-8 sm:p-12 text-center">
              <Globe className="w-12 h-12 mx-auto mb-6 text-violet-600" />
              {missionHeading && (
                <h2 className="text-2xl font-bold mb-4">{missionHeading}</h2>
              )}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {missionText}
              </p>
            </div>
          </div>
        )}

        {/* Values Grid */}
        {(values as Value[]).length > 0 && (
          <div className="mb-20">
            {valuesHeading && (
              <h2 className="text-2xl font-bold text-center mb-10">
                {valuesHeading}
              </h2>
            )}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {(values as Value[]).map((value, index) => {
                const IconComponent = iconMap[value.icon] || Sparkles;
                return (
                  <div
                    key={index}
                    className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-lg shadow-violet-500/5 p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {showTechStack && (techStack as TechItem[]).length > 0 && (
          <div className="max-w-3xl mx-auto">
            {techStackHeading && (
              <h2 className="text-2xl font-bold text-center mb-10">
                <Code className="inline-block w-6 h-6 mr-2 text-violet-600" />
                {techStackHeading}
              </h2>
            )}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-xl shadow-violet-500/5 p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(techStack as TechItem[]).map((tech, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-xl bg-violet-50 border border-violet-100"
                  >
                    <p className="font-semibold text-sm">{tech.name}</p>
                    {tech.category && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {tech.category}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
