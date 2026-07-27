import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { comparisonTableProps } from "./block";

export default function ComparisonTable({
  content,
}: BlockProps<typeof comparisonTableProps>) {
  const {
    fig = "",
    eyebrow = "",
    heading = "",
    description = "",
    competitors = [],
    rows = [],
    footnote = "",
  } = content;

  return (
    <section className="bg-background py-24">
      <Container>
        <div className="max-w-3xl">
          <FigEyebrow fig={fig} label={eyebrow} />
          <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-foreground text-balance">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[760px] border-collapse bg-card text-left text-[15px]">
            <thead>
              <tr className="bg-ink text-paper">
                <th className="px-5 py-4 font-medium" />
                <th className="bg-elektryk-700 px-5 py-4 font-heading font-semibold">
                  cmssy
                </th>
                {competitors.map((c) => (
                  <th key={c.name} className="px-5 py-4 font-medium">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <td className="px-5 py-4 font-medium text-foreground">
                    {row.label}
                  </td>
                  <td className="bg-elektryk/6 px-5 py-4 font-semibold text-foreground">
                    {row.cmssy}
                  </td>
                  {(row.values ?? "").split("|").map((v, i) => (
                    <td key={i} className="px-5 py-4 text-muted-foreground">
                      {v.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footnote && (
          <p className="mt-4 text-center font-mono text-[12px] text-muted-foreground">
            {footnote}
          </p>
        )}
      </Container>
    </section>
  );
}
