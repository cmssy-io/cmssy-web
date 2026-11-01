import { ArrowRight, FileText } from "lucide-react";
import { CmssyLink } from "@/components/cmssy-locale";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { DocsSearchTrigger } from "@/components/docs-search-trigger";
import { getLucideIcon } from "@/components/get-lucide-icon";
import type { docsHeroProps } from "./block";

export default function DocsHero({
  content,
}: BlockProps<typeof docsHeroProps>) {
  const {
    badge,
    heading,
    description,
    variant = "default",
    quickLinks = [],
    showSearch = false,
    searchPlaceholder,
  } = content;

  const bgClasses = {
    default: "bg-background",
    gradient: "bg-muted",
    minimal: "bg-background",
  };

  return (
    <section className={`relative overflow-hidden ${bgClasses[variant]}`}>
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
        <div
          className={`max-w-3xl mx-auto text-center ${
            quickLinks.length > 0 ? "mb-12 lg:mb-16" : ""
          }`}
        >
          {badge && (
            <div className="mb-5">
              <FigEyebrow fig="" label={badge} />
            </div>
          )}

          {heading && (
            <h1 className="mb-5 font-heading text-h2 font-semibold text-foreground text-balance">
              {heading}
            </h1>
          )}

          {description && (
            <p className="mx-auto max-w-2xl text-lead text-muted-foreground">
              {description}
            </p>
          )}

          {showSearch && searchPlaceholder && (
            <div className="mt-8">
              <DocsSearchTrigger placeholder={searchPlaceholder} />
            </div>
          )}
        </div>

        {quickLinks.length > 0 && (
          <div
            className={`grid gap-5 max-w-4xl mx-auto ${
              quickLinks.length <= 2
                ? "md:grid-cols-2"
                : quickLinks.length === 3
                  ? "md:grid-cols-3"
                  : "md:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {quickLinks.map((link, index) => {
              const Icon = getLucideIcon(link.icon, FileText);

              return (
                <CmssyLink
                  key={index}
                  href={link.url}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/25"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-muted p-2 text-foreground">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-heading font-semibold">{link.title}</h3>
                  </div>
                  {link.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {link.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    <span>Get started</span>
                    <ArrowRight className="size-3.5" />
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
