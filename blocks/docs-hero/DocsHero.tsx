import { ArrowRight, FileText } from "lucide-react";
import { CmssyLink } from "@/components/cmssy-locale";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { DocsQuickstart } from "@/components/docs-quickstart";
import { DocsSearchTrigger } from "@/components/docs-search-trigger";
import { getLucideIcon } from "@/components/get-lucide-icon";
import { groupQuickstart } from "@/lib/docs-quickstart";
import type { docsHeroProps } from "./block";
import { withStyle } from "@/lib/block-style";

function Highlighted({ text, word }: { text: string; word?: string }) {
  const needle = word?.trim();
  if (!needle) return <>{text}</>;
  const at = text.indexOf(needle);
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-primary">{needle}</span>
      {text.slice(at + needle.length)}
    </>
  );
}

export default function DocsHero({
  content: rawContent,
  style,
}: BlockProps<typeof docsHeroProps>) {
  const content = withStyle(rawContent, style);
  const {
    badge,
    heading,
    highlight,
    description,
    variant = "default",
    layout = "centered",
    quickLinks = [],
    showSearch = false,
    searchPlaceholder,
    commands = [],
    copyLabel,
    copiedLabel,
    quickLinksEyebrow,
    quickLinksHeading,
    quickLinksDescription,
    quickLinksMoreLabel,
    quickLinksMoreUrl,
  } = content;

  const bgClasses = {
    default: "bg-background",
    gradient: "bg-muted",
    minimal: "bg-background",
  };

  const dots = variant !== "minimal" && (
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    />
  );

  if (layout === "split") {
    const tabs = groupQuickstart(commands);
    const hasCard = quickLinks.length > 0;

    return (
      <section className={`relative overflow-hidden ${bgClasses[variant]}`}>
        {dots}
        <Container className="relative py-section-tight">
          <div
            className={`grid items-start gap-10 ${
              hasCard ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14" : ""
            }`}
          >
            <div className="min-w-0">
              {badge && <FigEyebrow fig="" label={badge} />}
              {heading && (
                <h1
                  className={`font-heading text-h2 font-semibold text-balance text-foreground ${badge ? "mt-3.5" : ""}`}
                >
                  <Highlighted text={heading} word={highlight} />
                </h1>
              )}
              {description && (
                <p className="mt-4 max-w-[56ch] text-lead text-muted-foreground">
                  {description}
                </p>
              )}
              {showSearch && searchPlaceholder && (
                <div className="mt-6">
                  <DocsSearchTrigger placeholder={searchPlaceholder} />
                </div>
              )}
              {tabs.length > 0 && (
                <div className="mt-6">
                  <DocsQuickstart
                    tabs={tabs}
                    copyLabel={copyLabel}
                    copiedLabel={copiedLabel}
                  />
                </div>
              )}
            </div>

            {hasCard && (
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                {quickLinksEyebrow && (
                  <FigEyebrow fig="" label={quickLinksEyebrow} />
                )}
                {quickLinksHeading && (
                  <h2 className="mt-2 font-heading text-xl font-semibold">
                    {quickLinksHeading}
                  </h2>
                )}
                {quickLinksDescription && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {quickLinksDescription}
                  </p>
                )}
                <div
                  className={`mt-4 grid gap-2.5 ${
                    quickLinks.length >= 4
                      ? "grid-cols-2 sm:grid-cols-4"
                      : quickLinks.length === 3
                        ? "grid-cols-3"
                        : "grid-cols-2"
                  }`}
                >
                  {quickLinks.map((link, index) => (
                    <CmssyLink
                      key={index}
                      href={link.url}
                      className="flex min-h-[92px] flex-col justify-between gap-5 rounded-[10px] border border-border bg-background p-3 transition-colors duration-[160ms] hover:border-foreground"
                    >
                      <span
                        className={`inline-block size-2.5 rounded-[3px] ${
                          index === 0 ? "bg-elektryk" : "bg-foreground"
                        }`}
                      />
                      <span className="flex items-end justify-between gap-2 font-heading text-[13px] font-semibold leading-tight sm:text-sm">
                        <span className="min-w-0">{link.title}</span>
                        <ArrowRight aria-hidden="true" className="size-3.5 shrink-0" />
                      </span>
                    </CmssyLink>
                  ))}
                </div>
                {quickLinksMoreLabel && quickLinksMoreUrl && (
                  <CmssyLink
                    href={quickLinksMoreUrl}
                    className="mt-4 flex items-center justify-end gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {quickLinksMoreLabel}
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </CmssyLink>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className={`relative overflow-hidden ${bgClasses[variant]}`}>
      {dots}

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
              <Highlighted text={heading} word={highlight} />
            </h1>
          )}

          {description && (
            <p className="mx-auto max-w-2xl text-lead text-muted-foreground">
              {description}
            </p>
          )}

          {showSearch && searchPlaceholder && (
            <div className="mt-8 flex justify-center">
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
