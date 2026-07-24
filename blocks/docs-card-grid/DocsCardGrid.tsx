import { ArrowRight, FileText } from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
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
          {heading && <h2 className="text-2xl font-bold mb-2">{heading}</h2>}
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
              className="group relative flex flex-col p-6 rounded-xl border bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </CmssyLink>
          );
        })}
      </div>
    </Container>
  );
}
