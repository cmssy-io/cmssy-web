import { CmssyLink } from "./cmssy-locale";
import { Container } from "./container";
import { FigEyebrow } from "./fig-eyebrow";

type Band = "paper" | "muted" | "ink";

const BAND: Record<Band, string> = {
  paper: "bg-background text-foreground py-6",
  muted: "bg-muted text-foreground py-section-tight",
  ink: "dot-grid-dark bg-ink text-paper py-section-tight",
};

export function cardGridCols(columns: string): string {
  return (
    {
      "2": "md:grid-cols-2",
      "3": "md:grid-cols-2 lg:grid-cols-3",
      "4": "md:grid-cols-2 lg:grid-cols-4",
    }[columns] ?? "md:grid-cols-2 lg:grid-cols-3"
  );
}

export function DocsCardBand({
  band = "paper",
  fig,
  eyebrow,
  heading,
  description,
  children,
}: {
  band?: string;
  fig?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  children: React.ReactNode;
}) {
  const tone = (band in BAND ? band : "paper") as Band;
  const dark = tone === "ink";
  const hasHeader = Boolean(fig || eyebrow || heading || description);

  return (
    <section className={BAND[tone]}>
      <Container>
        {hasHeader && (
          <div className="mb-7 flex flex-col gap-2.5">
            {(fig || eyebrow) && (
              <FigEyebrow fig={fig ?? ""} label={eyebrow ?? ""} dark={dark} />
            )}
            {heading && (
              <h2 className="font-heading text-h3 font-semibold text-balance">
                {heading}
              </h2>
            )}
            {description && (
              <p
                className={`max-w-[62ch] ${
                  dark ? "text-paper/70" : "text-muted-foreground"
                }`}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

export function DocsCard({
  href,
  title,
  description,
  footer,
  dark,
}: {
  href: string;
  title: string;
  description?: string;
  footer?: string;
  dark?: boolean;
}) {
  return (
    <CmssyLink
      href={href}
      className={`flex min-w-0 flex-col gap-1.5 rounded-2xl border p-[18px] pb-3.5 transition-colors duration-[160ms] ${
        dark
          ? "border-paper/10 bg-ink-deep text-paper hover:border-paper/40"
          : "border-border bg-card text-foreground hover:border-foreground"
      }`}
    >
      <h3 className="font-heading text-base font-semibold">{title}</h3>
      {description && (
        <p
          className={`text-sm ${dark ? "text-paper/60" : "text-muted-foreground"}`}
        >
          {description}
        </p>
      )}
      <span
        className={`mt-auto flex items-center justify-between gap-3 pt-2.5 font-mono text-[11px] ${
          dark ? "text-paper/60" : "text-muted-foreground"
        }`}
      >
        <span className="truncate">{footer}</span>
        <span className={dark ? "text-elektryk-300" : "text-primary"}>
          &rarr;
        </span>
      </span>
    </CmssyLink>
  );
}
