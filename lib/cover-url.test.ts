import { describe, expect, it } from "vitest";
import { coverUrl } from "./cover-url";

const field = (value: unknown) => [
  { fieldKey: "author", value: "Cmssy Team" },
  { fieldKey: "cover_image", value },
];

describe("coverUrl", () => {
  it("reads a media reference", () => {
    const url = "https://assets.cmssy.io/a.webp";
    expect(coverUrl(field({ id: "m1", url }))).toBe(url);
  });

  it("reads a legacy url string", () => {
    expect(coverUrl(field("https://assets.cmssy.io/old.jpg"))).toBe(
      "https://assets.cmssy.io/old.jpg",
    );
  });

  it("treats a missing, empty or malformed cover as none", () => {
    expect(coverUrl(undefined)).toBeUndefined();
    expect(coverUrl([])).toBeUndefined();
    expect(coverUrl(field(""))).toBeUndefined();
    expect(coverUrl(field({ url: "" }))).toBeUndefined();
    expect(coverUrl(field({ url: 7 }))).toBeUndefined();
    expect(coverUrl(field(null))).toBeUndefined();
  });
});
