import type { BlockProps } from "@cmssy/react";
import { DocsCard, DocsCardBand, cardGridCols } from "@/components/docs-card";
import type { docsCardGridProps } from "./block";

export function cardFooter(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      return `${parsed.host}${parsed.pathname === "/" ? "" : parsed.pathname}`;
    } catch {
      return trimmed;
    }
  }
  return trimmed.replace(/^\/+/, "").split(/[?#]/)[0];
}

export default function DocsCardGrid({
  content,
}: BlockProps<typeof docsCardGridProps>) {
  const {
    fig,
    eyebrow,
    heading,
    description,
    columns = "3",
    band = "paper",
    cards = [],
  } = content;

  return (
    <DocsCardBand
      band={band}
      fig={fig}
      eyebrow={eyebrow}
      heading={heading}
      description={description}
    >
      <div className={`grid gap-3 ${cardGridCols(columns)}`}>
        {cards.map((card, index) => (
          <DocsCard
            key={index}
            href={card.url}
            title={card.title}
            description={card.description}
            footer={cardFooter(card.url)}
            dark={band === "ink"}
          />
        ))}
      </div>
    </DocsCardBand>
  );
}
