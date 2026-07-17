import Image from "next/image";
import type { PageItem } from "@cmssy/types";
import { CmssyLink } from "@cmssy/next/client";
import { formatDate } from "@/lib/utils";
import { getCustomField, getLocalizedField } from "./utils";

export function PlaceholderCard() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-background border animate-pulse">
      <div className="aspect-video bg-muted" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-5 w-4/5 bg-muted rounded" />
        <div className="h-10 w-full bg-muted/60 rounded" />
        <div className="h-3 w-2/5 bg-muted/40 rounded mt-auto" />
      </div>
    </div>
  );
}

export function PostCard({
  item,
  language,
  layout,
}: {
  item: PageItem;
  language: string;
  layout: string;
}) {
  const title = getLocalizedField(item.displayName, language);
  const excerpt = getLocalizedField(item.seoDescription, language);
  const coverImage = getCustomField(item, "cover_image") as string | null;
  const rawAuthor = getCustomField(item, "author") as string | null;
  const author =
    rawAuthor && !/^[0-9a-f]{24}$/.test(rawAuthor) ? rawAuthor : null;
  const category = getCustomField(item, "category") as string | null;
  const publishDate =
    (getCustomField(item, "publish_date") as string | null) ?? item.publishedAt;

  const isList = layout === "list";

  return (
    <CmssyLink
      href={item.fullSlug}
      className={`group flex ${isList ? "flex-row" : "flex-col"} rounded-2xl overflow-hidden bg-background border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 no-underline text-inherit`}
    >
      {coverImage ? (
        <div
          className={`relative overflow-hidden ${isList ? "w-64 min-h-40 shrink-0" : "aspect-video"}`}
        >
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes={
              isList
                ? "256px"
                : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div
          className={`bg-muted ${isList ? "w-64 min-h-40 shrink-0" : "aspect-video"}`}
        />
      )}
      <div className="p-5 flex flex-col gap-2 flex-1">
        {category && (
          <span className="text-xs font-medium text-sky-600">
            {category}
          </span>
        )}
        <h3 className="text-lg font-semibold leading-snug">{title}</h3>
        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-2">
          {publishDate && (
            <time dateTime={publishDate}>
              {formatDate(publishDate, language)}
            </time>
          )}
          {author && <span className="font-medium">{author}</span>}
        </div>
      </div>
    </CmssyLink>
  );
}
