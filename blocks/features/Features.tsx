import {
  BarChart3,
  Blocks,
  Cloud,
  Globe,
  Layers,
  Lock,
  Paintbrush,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Square,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/container";
import type { BlockProps } from "@cmssy/react";
import type { featuresProps } from "./block";

const iconMap: Record<string, LucideIcon> = {
  ZapIcon: Zap,
  SparklesIcon: Sparkles,
  GlobeAltIcon: Globe,
  LayersIcon: Layers,
  PaintBrushIcon: Paintbrush,
  Squares2X2Icon: Square,
  LightningBoltIcon: Zap,
  CloudIcon: Cloud,
  LockClosedIcon: Lock,
  CogIcon: Settings,
  ChartBarIcon: BarChart3,
  DeviceMobileIcon: Smartphone,
  UsersIcon: Users,
  ShieldCheckIcon: ShieldCheck,
  BlocksIcon: Blocks,
};

export default function Features({ content }: BlockProps<typeof featuresProps>) {
  const { heading, headingHighlight, description, features = [] } = content;

  return (
    <section id="features" className="py-24 bg-slate-50/50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon ? iconMap[feature.icon] : Zap;
            const bgColor = feature.color || "#0ea5e9";
            const hoverColor = feature.hoverColor || bgColor;

            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-background border transition-all duration-300 hover:shadow-lg"
                style={
                  {
                    "--feature-color": bgColor,
                    "--feature-hover-color": hoverColor,
                  } as React.CSSProperties
                }
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: bgColor }}
                >
                  {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>

                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"
                  style={{ backgroundColor: hoverColor }}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
