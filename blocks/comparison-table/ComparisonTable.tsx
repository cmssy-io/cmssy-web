import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { comparisonTableProps } from "./block";

export default function ComparisonTable({
  content,
}: BlockProps<typeof comparisonTableProps>) {
  const {
    fig = "FIG 5.0",
    eyebrow = "",
    heading = "",
    description = "",
    competitors = [],
    rows = [],
    footnote = "",
  } = content;

  return (
    <section className="bg-paper py-24">
      <Container>
        <div className="max-w-3xl">
          <FigEyebrow fig={fig} label={eyebrow} />
          <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-ink text-balance">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-ink/60">{description}</p>
          )}
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="w-full min-w-[760px] border-collapse bg-white text-left text-[15px]">
            <thead>
              <tr className="bg-ink text-paper">
                <th className="px-5 py-4 font-medium" />
                <th className="bg-elektryk px-5 py-4 font-heading font-semibold">
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
                <tr key={row.label} className="border-t border-ink/8">
                  <td className="px-5 py-4 font-medium text-ink">
                    {row.label}
                  </td>
                  <td className="bg-elektryk/6 px-5 py-4 font-semibold text-ink">
                    {row.cmssy}
                  </td>
                  {(row.values ?? "").split("|").map((v, i) => (
                    <td key={i} className="px-5 py-4 text-ink/60">
                      {v.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footnote && (
          <p className="mt-4 text-center font-mono text-[12px] text-ink/40">
            {footnote}
          </p>
        )}
      </Container>
    </section>
  );
}
