import { describe, expect, it } from "vitest";
import { withStyle } from "./block-style";

describe("withStyle", () => {
  it("reads a style-tab field from the style bucket, where the manifest keeps it", () => {
    expect(withStyle({ heading: "Docs" }, { layout: "split" })).toEqual({
      heading: "Docs",
      layout: "split",
    });
  });

  it("lets the style bucket win over a stale copy in content", () => {
    expect(withStyle({ columns: "3" }, { columns: "4" })).toEqual({ columns: "4" });
  });

  it("keeps a value that only older content still carries", () => {
    expect(withStyle({ variant: "gradient" }, {})).toEqual({ variant: "gradient" });
    expect(withStyle({ variant: "gradient" }, { variant: "" })).toEqual({
      variant: "gradient",
    });
    expect(withStyle({ variant: "gradient" })).toEqual({ variant: "gradient" });
  });
});
