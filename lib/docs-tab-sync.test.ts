import { describe, expect, it } from "vitest";
import { hasCode, resolveTabIndex, tabSyncStorageKey } from "./docs-tab-sync";

const frameworks = ["Next.js", "Astro", "React Router"];

describe("resolveTabIndex", () => {
  it("opens the tab the reader chose in another block of the same group", () => {
    expect(resolveTabIndex(frameworks, "Astro", 0)).toBe(1);
  });

  it("keeps its own tab when the choice is not one of its labels", () => {
    expect(resolveTabIndex(["npm", "pnpm"], "Astro", 1)).toBe(1);
  });

  it("falls back to its own tab before anything was chosen", () => {
    expect(resolveTabIndex(frameworks, null, 2)).toBe(2);
  });

  it("clamps an index outside the tabs it has", () => {
    expect(resolveTabIndex(frameworks, null, 7)).toBe(2);
    expect(resolveTabIndex(frameworks, null, -1)).toBe(0);
    expect(resolveTabIndex([], null, 3)).toBe(0);
  });
});

describe("tabSyncStorageKey", () => {
  it("namespaces each group separately", () => {
    expect(tabSyncStorageKey("framework")).not.toBe(
      tabSyncStorageKey("package-manager"),
    );
  });
});

describe("hasCode", () => {
  it("finds a code block in rich text", () => {
    expect(hasCode('<p>Run</p><pre class="shiki"><code>npx</code></pre>')).toBe(
      true,
    );
    expect(hasCode("<pre><code>npx</code></pre>")).toBe(true);
  });

  it("ignores inline code and lookalike tags", () => {
    expect(hasCode("<p>Run <code>npx</code></p><preview></preview>")).toBe(
      false,
    );
  });
});
