import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { CmssyLink } from "@/components/cmssy-locale";
import { mediaUrl } from "@cmssy/core";
import type { BlockProps } from "@cmssy/react";
import { Container } from "../../components/container";
import { formatDate } from "@/lib/utils";
import { siteUrl } from "@/lib/site-url";
import { JsonLd } from "@/components/json-ld";
import type { blogPostHeroProps } from "./block";

export default function BlogPostHero({
  content,
  context,
}: BlockProps<typeof blogPostHeroProps>) {
  const lang = context?.locale.current;
  const {
    coverImage,
    title,
    excerpt,
    category,
    author,
    authorAvatar,
    date,
    readingTime = 5,
    breadcrumbLabel,
    breadcrumbUrl,
  } = content;
  const coverImageUrl = mediaUrl(coverImage);
  const authorAvatarUrl = mediaUrl(authorAvatar);

  return (
    <section className="blog-post-hero relative overflow-hidden">
      {title ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            ...(excerpt ? { description: excerpt } : {}),
            ...(coverImageUrl ? { image: [coverImageUrl] } : {}),
            ...(author
              ? {
                  author: {
                    // "Cmssy Team" is the company, not a person.
                    "@type": /team$/i.test(author.trim()) ? "Organization" : "Person",
                    name: author,
                  },
                }
              : {}),
            publisher: {
              "@type": "Organization",
              name: "cmssy",
              // siteUrl() is "" when NEXT_PUBLIC_SITE_URL is unset; an empty
              // URL is invalid Schema.org, so leave it out.
              ...(siteUrl() ? { url: siteUrl() } : {}),
            },
            ...(date ? { datePublished: date } : {}),
          }}
        />
      ) : null}
      {title && breadcrumbLabel && breadcrumbUrl ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: breadcrumbLabel,
                item: breadcrumbUrl.startsWith("/")
                  ? `${siteUrl()}${breadcrumbUrl}`
                  : breadcrumbUrl,
              },
              { "@type": "ListItem", position: 2, name: title },
            ],
          }}
        />
      ) : null}
      <div className="relative min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh] flex flex-col justify-end">
        {coverImageUrl ? (
          <>
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/50 to-ink/20" />
          </>
        ) : (
          <div className="dot-grid-dark absolute inset-0 bg-ink" />
        )}

        <Container className="relative z-10 pb-10 sm:pb-14 pt-32">
          <nav className="mb-5 flex items-center gap-2 text-sm text-paper/60">
            {breadcrumbLabel && breadcrumbUrl && (
              <>
                <CmssyLink
                  href={breadcrumbUrl}
                  className="text-paper/60 no-underline transition-colors hover:text-paper"
                >
                  {breadcrumbLabel}
                </CmssyLink>
                <span className="text-paper/30">/</span>
              </>
            )}
            {title && (
              <span className="max-w-50 truncate text-paper/40 sm:max-w-none">
                {title}
              </span>
            )}
          </nav>

          {category && (
            <span className="mb-5 flex items-center gap-2 font-mono text-small text-paper/60">
              <span className="inline-block size-2 rounded-[2px] bg-elektryk" />
              {category}
            </span>
          )}

          {title && (
            <h1 className="mb-4 max-w-4xl font-heading text-h1 font-semibold text-paper text-balance">
              {title}
            </h1>
          )}

          {excerpt && (
            <p className="mb-7 max-w-2xl text-lead text-paper/70">{excerpt}</p>
          )}

          <div className="mb-5 h-px w-16 bg-paper/20" />

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-paper/60">
            {author && (
              <div className="flex items-center gap-2.5">
                {authorAvatarUrl ? (
                  <Image
                    src={authorAvatarUrl}
                    alt={author}
                    width={28}
                    height={28}
                    className="rounded-full object-cover ring-2 ring-paper/20"
                  />
                ) : (
                  <div className="flex size-7 items-center justify-center rounded-full bg-paper/15 text-label font-semibold text-paper">
                    {author.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-paper/90">{author}</span>
              </div>
            )}

            {date && (
              <time dateTime={date} className="flex items-center gap-1.5">
                <Calendar size={14} strokeWidth={1.5} />
                {formatDate(date, lang)}
              </time>
            )}

            {readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} strokeWidth={1.5} />
                {readingTime} min read
              </span>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}
