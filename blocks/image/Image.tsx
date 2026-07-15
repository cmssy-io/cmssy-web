import NextImage from "next/image";
import type { BlockProps } from "@cmssy/react";
import type { imageProps } from "./block";

const widthClasses: Record<string, string> = {
  small: "max-w-[480px]",
  medium: "max-w-[640px]",
  large: "max-w-[800px]",
  full: "max-w-none",
};

export default function Image({ content }: BlockProps<typeof imageProps>) {
  const { src, alt = "", caption, width = "full", rounded = true } = content;

  if (!src) {
    return null;
  }

  return (
    <figure className="py-4 px-4 sm:px-6 lg:px-8">
      <div className={`mx-auto ${widthClasses[width] || widthClasses.full}`}>
        <NextImage
          src={src}
          alt={alt}
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, 800px"
          className={`w-full h-auto ${rounded ? "rounded-lg" : ""}`}
        />
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-neutral-500">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
