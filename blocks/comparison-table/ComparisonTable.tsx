import type { BlockProps } from "@cmssy/react";
import { Reveal } from "@/components/motion/reveal";
import { ScrollHint } from "@/components/scroll-hint";
import { Section } from "@/components/section";
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
    <Section fig={fig} eyebrow={eyebrow} heading={heading} lead={description}>
      <Reveal>
        <ScrollHint tone="light" className="rounded-2xl border border-border">
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
        </ScrollHint>
      </Reveal>
      {footnote && (
        <p className="mt-4 font-mono text-[12px] text-muted-foreground">
          {footnote}
        </p>
      )}
    </Section>
  );
}
