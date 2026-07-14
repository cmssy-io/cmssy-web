import type { BlockProps } from "@cmssy/react";
import { useState, useEffect } from "react";
import NextImage from "next/image";
import { ZoomIn, X } from "lucide-react";
import { Container } from "../../../components/container";
import type { docsImageProps } from "../block";

type DocsImageStyle = Pick<
  BlockProps<typeof docsImageProps>["content"],
  "width" | "border" | "rounded" | "shadow"
>;

export default function DocsImage({
  content,
  style = {},
}: {
  content: BlockProps<typeof docsImageProps>["content"];
  style?: DocsImageStyle;
}) {
  const { src, alt = "", caption, zoomable = true } = content;
  const {
    width = "large",
    border = true,
    rounded = true,
    shadow = true,
  } = style;

  const [isZoomed, setIsZoomed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isZoomed) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isZoomed]);

  if (!src) {
    return null;
  }

  const widthClasses = {
    small: "max-w-[480px]",
    medium: "max-w-[640px]",
    large: "max-w-[800px]",
    full: "max-w-none",
  };

  const imageClasses = [
    "w-full h-auto",
    border && "border border-border",
    rounded && "rounded-lg",
    shadow && "shadow-md",
    zoomable && "cursor-zoom-in",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Container as="figure" className="py-6">
      <div className={`mx-auto ${widthClasses[width]}`}>
        {/* Image with zoom hint */}
        <div className="relative group">
          <NextImage
            src={src}
            alt={alt}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 800px"
            className={imageClasses}
            onClick={() => zoomable && setIsZoomed(true)}
          />
          {zoomable && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="p-2 rounded-full bg-black/50 text-white backdrop-blur-sm">
                <ZoomIn className="h-5 w-5" />
              </div>
            </div>
          )}
        </div>

        {/* Caption */}
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground">
            {caption}
          </figcaption>
        )}
      </div>

      {/* Lightbox overlay */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </Container>
  );
}
