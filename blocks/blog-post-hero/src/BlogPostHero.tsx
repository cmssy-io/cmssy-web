import type { BlockProps } from "@cmssy/react";
import Image from "next/image";
import { CmssyLink } from "@cmssy/next/client";
import { Container } from "../../../components/container";
import type { blogPostHeroProps } from "../block";

function formatDate(dateStr: string | undefined, lang = "en"): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(lang, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BlogPostHero({
  content,
}: BlockProps<typeof blogPostHeroProps>) {
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
    breadcrumbUrl = "/blog",
  } = content;

  return (
    <section className="blog-post-hero relative overflow-hidden">
      {/* Background - cover image or gradient */}
      <div className="relative min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh] flex flex-col justify-end">
        {coverImage ? (
          <>
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-900" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        )}

        {/* Content - positioned at bottom of cover */}
        <Container className="relative z-10 pb-10 sm:pb-14 pt-32">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-5">
            {breadcrumbLabel && (
              <>
                <CmssyLink
                  href={breadcrumbUrl}
                  className="hover:text-white transition-colors no-underline text-white/60"
                >
                  {breadcrumbLabel}
                </CmssyLink>
                <span className="text-white/30">/</span>
              </>
            )}
            {title && (
              <span className="text-white/40 truncate max-w-[200px] sm:max-w-none">
                {title}
              </span>
            )}
          </nav>

          {/* Category */}
          {category && (
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-white bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded mb-5">
              {category}
            </span>
          )}

          {/* Title */}
          {title && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-4 max-w-4xl">
              {title}
            </h1>
          )}

          {/* Excerpt */}
          {excerpt && (
            <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-7 max-w-2xl">
              {excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="w-16 h-px bg-white/25 mb-5" />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
            {author && (
              <div className="flex items-center gap-2.5">
                {authorAvatar ? (
                  <Image
                    src={authorAvatar}
                    alt={author}
                    width={28}
                    height={28}
                    className="rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-semibold">
                    {author.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-white/90">{author}</span>
              </div>
            )}

            {date && (
              <time dateTime={date} className="flex items-center gap-1.5">
                <svg
                  width={14}
                  height={14}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(date)}
              </time>
            )}

            {readingTime && (
              <span className="flex items-center gap-1.5">
                <svg
                  width={14}
                  height={14}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readingTime} min read
              </span>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}
