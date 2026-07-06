import * as Icons from "lucide-react";
import { ArrowRight, LucideIcon } from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
import { Container } from "../../../components/container";
import { BlockContent, BlockStyle } from "./block";

function getIcon(name?: string): LucideIcon {
  if (!name) return Icons.FileText;
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon || Icons.FileText;
}

export default function DocsHero({
  content,
  style = {},
}: {
  content: BlockContent;
  style?: BlockStyle;
}) {
  const { badge, heading, description, quickLinks = [] } = content;
  const { variant = "default" } = style;

  const bgClasses = {
    default: "bg-background",
    gradient: "bg-gradient-to-b from-violet-50 via-background to-background",
    minimal: "bg-background",
  };

  return (
    <section className={`relative overflow-hidden ${bgClasses[variant]}`}>
      {/* Subtle grid pattern for default/gradient */}
      {variant !== "minimal" && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

      <Container className="relative py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium tracking-wider uppercase rounded-full bg-violet-100 text-violet-700">
              {badge}
            </div>
          )}

          {/* Heading */}
          {heading && (
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 ${
                variant === "minimal"
                  ? "text-foreground"
                  : "bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
              }`}
            >
              {heading}
            </h1>
          )}

          {/* Description */}
          {description && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Quick Links Grid */}
        {quickLinks.length > 0 && (
          <div
            className={`grid gap-4 max-w-4xl mx-auto ${
              quickLinks.length <= 2
                ? "md:grid-cols-2"
                : quickLinks.length === 3
                  ? "md:grid-cols-3"
                  : "md:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {quickLinks.map((link, index) => {
              const Icon = getIcon(link.icon);

              return (
                <CmssyLink
                  key={index}
                  href={link.url}
                  className="group relative flex flex-col p-5 rounded-xl border bg-card hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-violet-100 text-violet-600 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold group-hover:text-violet-600 transition-colors">
                      {link.title}
                    </h3>
                  </div>
                  {link.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {link.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-1 text-sm font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Get started</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </CmssyLink>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
