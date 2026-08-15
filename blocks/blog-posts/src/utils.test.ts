import { describe, expect, it } from "vitest";
import { pageSelectorSlug } from "./utils";

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
