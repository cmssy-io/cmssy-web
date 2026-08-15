import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { Reveal } from "@/components/motion/reveal";

type Band = "paper" | "wash" | "ink";
type Align = "left" | "center";

const BAND: Record<Band, string> = {
  paper: "bg-background text-foreground",
  wash: "bg-wash text-foreground",
  ink: "dot-grid-dark bg-ink text-paper",
};

/**
 * One component owns band colour, vertical rhythm, the FIG plate, the heading
 * and the lead.
 *
 * Left is the only default alignment. Centring is a deliberate exception - the
 * closing CTA - not a per-block preference, which is how the page drifted into
 * alternating alignment in the first place.
 */
export function Section({
  fig,
  eyebrow,
  heading,
  lead,
  band = "paper",
  align = "left",
  tight,
  id,
  className,
  headerClassName,
  children,
}: {
  fig?: string;
  eyebrow?: string;
  heading?: React.ReactNode;
  lead?: React.ReactNode;
  band?: Band;
  align?: Align;
  tight?: boolean;
  id?: string;
  className?: string;
  headerClassName?: string;
  children?: React.ReactNode;
}) {
  const dark = band === "ink";
  const hasHeader = Boolean(fig || eyebrow || heading || lead);

  return (
    <section
      id={id}
      className={`${BAND[band]} ${tight ? "py-section-tight" : "py-section"} ${className ?? ""}`.trim()}
    >
      <Container>
        {hasHeader ? (
          <div
            className={`flex flex-col gap-4 ${
              align === "center" ? "items-center text-center" : "items-start"
            } ${headerClassName ?? ""}`.trim()}
          >
            {fig || eyebrow ? (
              <Reveal>
                <FigEyebrow fig={fig ?? ""} label={eyebrow ?? ""} dark={dark} />
              </Reveal>
            ) : null}
            {heading ? (
              <Reveal index={1}>
                <h2 className="max-w-[22ch] font-heading text-h2 font-semibold text-balance">
                  {heading}
                </h2>
              </Reveal>
            ) : null}
            {lead ? (
              <Reveal index={2}>
                <p
                  className={`max-w-[62ch] text-lead ${
                    dark ? "text-paper/70" : "text-muted-foreground"
                  }`}
                >
                  {lead}
                </p>
              </Reveal>
            ) : null}
          </div>
        ) : null}
        {children ? <div className={hasHeader ? "mt-12" : ""}>{children}</div> : null}
      </Container>
    </section>
  );
}
