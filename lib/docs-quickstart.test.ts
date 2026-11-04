import { describe, expect, it } from "vitest";
import { groupQuickstart, pickRunner } from "./docs-quickstart";

describe("groupQuickstart", () => {
  it("groups rows by tab and runner in the order given", () => {
    const tabs = groupQuickstart([
      { tab: "For you", runner: "npx", command: "npx @cmssy/cli@latest init", note: "Adds the SDK.", noteLabel: "Installation", noteUrl: "/docs/start/installation" },
      { tab: "For you", runner: "pnpm", command: "pnpm dlx @cmssy/cli@latest init" },
      { tab: "For your agent", command: "claude mcp add --transport http cmssy https://api.cmssy.io/mcp" },
    ]);
    expect(tabs.map((tab) => tab.label)).toEqual(["For you", "For your agent"]);
    expect(tabs[0].runners).toEqual(["npx", "pnpm"]);
    expect(tabs[0].commands.pnpm).toBe("pnpm dlx @cmssy/cli@latest init");
    expect(tabs[0].note).toBe("Adds the SDK.");
    expect(tabs[0].noteUrl).toBe("/docs/start/installation");
    expect(tabs[1].runners).toEqual([""]);
    expect(tabs[1].commands[""]).toContain("claude mcp add");
  });

  it("drops rows without a command and keeps the first command per runner", () => {
    const tabs = groupQuickstart([
      { runner: "npx", command: "  " },
      { runner: "npx", command: "first" },
      { runner: "npx", command: "second" },
    ]);
    expect(tabs).toHaveLength(1);
    expect(tabs[0].commands.npx).toBe("first");
  });

  it("takes the note from the first row of the tab that has one", () => {
    const tabs = groupQuickstart([
      { tab: "a", runner: "npx", command: "x" },
      { tab: "a", runner: "pnpm", command: "y", note: "late note" },
    ]);
    expect(tabs[0].note).toBe("late note");
  });
});

describe("pickRunner", () => {
  it("keeps the reader's runner when the tab has it, else the tab's first", () => {
    const [tab] = groupQuickstart([
      { runner: "npx", command: "a" },
      { runner: "bunx", command: "b" },
    ]);
    expect(pickRunner(tab, "bunx")).toBe("bunx");
    expect(pickRunner(tab, "yarn")).toBe("npx");
  });
});
