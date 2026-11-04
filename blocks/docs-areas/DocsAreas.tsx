import type { BlockProps } from "@cmssy/react";
import { DocsCard, DocsCardBand, cardGridCols } from "@/components/docs-card";
import type { DocsSection } from "@/lib/docs-section";
import { fillCount } from "@/lib/docs-ui";
import type { docsAreasProps } from "./block";

export default function DocsAreas({
  content,
  data,
}: BlockProps<typeof docsAreasProps, DocsSection | null>) {
  const { fig, eyebrow, heading, description, band = "muted" } = content;
  if (!data || data.areas.length === 0) return null;

  return (
    <DocsCardBand
      band={band}
      fig={fig}
      eyebrow={eyebrow}
      heading={heading}
      description={description}
    >
      <div className={`grid gap-3 ${cardGridCols("3")}`}>
        {data.areas.map((area) => (
          <DocsCard
            key={area.slug}
            href={area.slug}
            title={area.label}
            description={area.description}
            footer={fillCount(data.ui.pageCount, area.pageCount)}
            dark={band === "ink"}
          />
        ))}
      </div>
    </DocsCardBand>
  );
}
