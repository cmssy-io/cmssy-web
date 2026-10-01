import { describe, expect, it } from "vitest";
import type { PageItem } from "@cmssy/types";
import { customMedia, pageSelectorSlug } from "./utils";

describe("pageSelectorSlug", () => {
  it("reads the slug a single page selector now hands over as a bare object", () => {
    expect(
      pageSelectorSlug({ slug: "/blog", displayName: { en: "Blog" } }),
    ).toBe("/blog");
  });

  it("still reads the list shape a multiple selector hands over", () => {
    expect(
      pageSelectorSlug([
        { slug: "/blog", displayName: { en: "Blog" } },
        { slug: "/news", displayName: { en: "News" } },
      ]),
    ).toBe("/blog");
  });

  it("reads the bare slug written before selectors carried a display name", () => {
    expect(pageSelectorSlug("/blog")).toBe("/blog");
  });

  it("treats an unset selector as unset, in every shape it can be unset in", () => {
    expect(pageSelectorSlug(undefined)).toBeUndefined();
    expect(pageSelectorSlug(null)).toBeUndefined();
    expect(pageSelectorSlug([])).toBeUndefined();
    expect(pageSelectorSlug("")).toBeUndefined();
    expect(pageSelectorSlug({ slug: "" })).toBeUndefined();
  });

  it("refuses a value that is not a page reference at all", () => {
    expect(pageSelectorSlug({ displayName: { en: "Blog" } })).toBeUndefined();
    expect(pageSelectorSlug({ slug: 7 })).toBeUndefined();
    expect(pageSelectorSlug(7)).toBeUndefined();
    expect(pageSelectorSlug([{ displayName: { en: "Blog" } }])).toBeUndefined();
  });
});

function itemWith(value: unknown): PageItem {
  return {
    id: "p1",
    slug: "/post",
    fullSlug: "/blog/post",
    publishedAt: null,
    displayName: {},
    seoTitle: null,
    seoDescription: null,
    pageType: "post",
    customFields: [{ fieldKey: "cover_image", value }],
  };
}

describe("customMedia", () => {
  it("reads the url off the media reference a media field hands over", () => {
    expect(
      customMedia(
        itemWith({
          id: "m1",
          url: "https://assets.cmssy.io/cover.jpg",
          visibility: "public",
          type: "image",
        }),
        "cover_image",
      ),
    ).toBe("https://assets.cmssy.io/cover.jpg");
  });

  it("still reads the bare url string the field carried before it became a reference", () => {
    expect(customMedia(itemWith("https://assets.cmssy.io/old.jpg"), "cover_image")).toBe(
      "https://assets.cmssy.io/old.jpg",
    );
  });

  it(
    "refuses a url that is not a string, whatever the media field put there - the " +
      "guard is the narrowing on the way out, so it holds for a shape no one wrote yet",
    () => {
      expect(customMedia(itemWith({ url: 7 }), "cover_image")).toBeNull();
      expect(customMedia(itemWith({ url: { href: "x" } }), "cover_image")).toBeNull();
      expect(customMedia(itemWith({ url: null }), "cover_image")).toBeNull();
    },
  );

  it("treats a field carrying no url at all as unset", () => {
    expect(customMedia(itemWith({ id: "m1", type: "image" }), "cover_image")).toBeNull();
    expect(customMedia(itemWith(7), "cover_image")).toBeNull();
    expect(customMedia(itemWith([]), "cover_image")).toBeNull();
  });

  it("treats every shape of empty as unset, so a caller's `?? fallback` reaches the fallback", () => {
    expect(customMedia(itemWith(""), "cover_image")).toBeNull();
    expect(customMedia(itemWith({ url: "" }), "cover_image")).toBeNull();
    expect(customMedia(itemWith(null), "cover_image")).toBeNull();
    expect(customMedia(itemWith(undefined), "cover_image")).toBeNull();
  });

  it("reads an absent field as unset rather than throwing", () => {
    expect(customMedia(itemWith("https://x/y.jpg"), "banner")).toBeNull();
  });
});
