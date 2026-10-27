import { describe, expect, it } from "vitest";
import {
  createTabChoiceStore,
  hasCode,
  resolveTabIndex,
  tabSyncStorageKey,
} from "./docs-tab-sync";

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

  it("keeps the clicked tab when another tab shares its label", () => {
    expect(resolveTabIndex(["Example", "Example"], "Example", 1)).toBe(1);
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

function memoryStorage() {
  const items = new Map<string, string>();
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
  };
}

function brokenStorage() {
  return {
    getItem: (): string | null => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  };
}

describe("createTabChoiceStore", () => {
  it("saves a choice and tells every block in the page", () => {
    const storage = memoryStorage();
    const store = createTabChoiceStore(() => storage);
    const heard: string[] = [];
    store.subscribe(() => heard.push("first"));
    store.subscribe(() => heard.push("second"));

    store.choose("k", "Astro");

    expect(store.read("k")).toBe("Astro");
    expect(storage.getItem("k")).toBe("Astro");
    expect(heard).toEqual(["first", "second"]);
  });

  it("stops telling a block that unsubscribed", () => {
    const store = createTabChoiceStore(memoryStorage);
    let heard = 0;
    const unsubscribe = store.subscribe(() => heard++);
    unsubscribe();

    store.choose("k", "Astro");

    expect(heard).toBe(0);
  });

  it("keeps the choice for this page when storage is blocked", () => {
    const store = createTabChoiceStore(brokenStorage);
    let heard = 0;
    store.subscribe(() => heard++);

    expect(store.read("k")).toBeNull();
    store.choose("k", "Astro");

    expect(store.read("k")).toBe("Astro");
    expect(heard).toBe(1);
  });

  it("reads a choice another browser tab saved", () => {
    const storage = memoryStorage();
    const store = createTabChoiceStore(() => storage);
    storage.setItem("k", "React Router");

    expect(store.read("k")).toBe("React Router");
  });
});
