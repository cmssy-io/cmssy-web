import { describe, expect, it } from "vitest";
import { fillCount, fillUrl, footerForUrl } from "./docs-ui";

describe("fillCount", () => {
  it("fills the placeholder and stays empty without a template", () => {
    expect(fillCount("{n} pages", 6)).toBe("6 pages");
    expect(fillCount(undefined, 6)).toBe("");
  });
});

describe("fillUrl", () => {
  it("fills the placeholder, appends the URL when there is none, falls back to the URL", () => {
    expect(fillUrl("Read {url} first.", "https://x/a.md")).toBe("Read https://x/a.md first.");
    expect(fillUrl("Summarise this page", "https://x/a.md")).toBe("Summarise this page https://x/a.md");
    expect(fillUrl(undefined, "https://x/a.md")).toBe("https://x/a.md");
  });
});

describe("footerForUrl", () => {
  it("shows the path of a site link and the host of an external one", () => {
    expect(footerForUrl("/docs/start/how-it-works")).toBe("docs/start/how-it-works");
    expect(footerForUrl("/docs/start?x=1#y")).toBe("docs/start");
    expect(footerForUrl("https://github.com/cmssy-io/examples")).toBe("github.com/cmssy-io/examples");
    expect(footerForUrl("https://cmssy.io/")).toBe("cmssy.io");
    expect(footerForUrl("  ")).toBe("");
  });
});
