import { describe, expect, it } from "vitest";
import { areaForSlug, pathWithin } from "./docs-nav";

const areas = [
  { slug: "/docs/ap" },
  { slug: "/docs/api" },
  { slug: "/docs/blocks" },
];

describe("areaForSlug", () => {
  it("matches the area's own slug and anything below it", () => {
    expect(areaForSlug("/docs/blocks", areas)?.slug).toBe("/docs/blocks");
    expect(areaForSlug("/docs/blocks/fields", areas)?.slug).toBe("/docs/blocks");
    expect(areaForSlug("/docs/blocks/", areas)?.slug).toBe("/docs/blocks");
  });

  it("matches whole segments, not prefixes", () => {
    expect(areaForSlug("/docs/api/mcp", areas)?.slug).toBe("/docs/api");
  });

  it("returns null for the root and for unknown paths", () => {
    expect(areaForSlug("/docs", areas)).toBeNull();
    expect(areaForSlug("/blog/post", areas)).toBeNull();
  });
});

describe("pathWithin", () => {
  it("drops a locale prefix in front of the root slug", () => {
    expect(pathWithin("/pl/docs/blocks/fields", "/docs")).toBe("/docs/blocks/fields");
    expect(pathWithin("/docs/blocks", "/docs")).toBe("/docs/blocks");
  });

  it("leaves a path that does not contain the root alone", () => {
    expect(pathWithin("/pl/blog", "/docs")).toBe("/pl/blog");
  });
});
