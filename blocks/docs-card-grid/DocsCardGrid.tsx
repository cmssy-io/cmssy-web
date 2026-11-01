import { ArrowRight, FileText } from "lucide-react";
import { CmssyLink } from "@/components/cmssy-locale";
import type { BlockProps } from "@cmssy/react";
import { Container } from "../../components/container";
import { getLucideIcon } from "../../components/get-lucide-icon";
import type { docsCardGridProps } from "./block";

export default function DocsCardGrid({
  content,
}: BlockProps<typeof docsCardGridProps>) {
  const { heading, description, columns = "3", cards = [] } = content;

  const gridCols = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-2 lg:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <Container as="section" className="py-6">
      {(heading || description) && (
        <div className="mb-8">
          {heading && (
            <h2 className="mb-2 font-heading text-h3 font-semibold">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div
        className={`grid gap-4 ${gridCols[columns as keyof typeof gridCols]}`}
      >
        {cards.map((card, index) => {
          const Icon = getLucideIcon(card.icon, FileText);

          return (
            <CmssyLink
              key={index}
              href={card.url}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-muted p-2 text-foreground">
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 font-heading font-semibold">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                <span>Learn more</span>
                <ArrowRight className="size-4" />
              </div>
            </CmssyLink>
          );
        })}
      </div>
    </Container>
  );
}
