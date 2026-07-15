import Image from "next/image";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import type { productShowcaseProps } from "./block";

export default function ProductShowcase({
  content,
}: BlockProps<typeof productShowcaseProps>) {
  const {
    badgeText,
    heading,
    headingHighlight,
    description,
    items = [],
  } = content;

  return (
    <section className="py-24">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              {badgeText}
            </div>
          )}
          {(heading || headingHighlight) && (
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {heading}{" "}
              {headingHighlight && (
                <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {headingHighlight}
                </span>
              )}
            </h2>
          )}
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {items.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <figure
                key={index}
                className="group flex flex-col rounded-xl border border-border/60 bg-background overflow-hidden shadow-sm transition-shadow hover:shadow-lg hover:shadow-violet-500/10"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      {item.title}
                    </div>
                  )}
                </div>
                <figcaption className="flex flex-col gap-1 p-5">
                  <span className="font-semibold">{item.title}</span>
                  {item.caption && (
                    <span className="text-sm text-muted-foreground">
                      {item.caption}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
