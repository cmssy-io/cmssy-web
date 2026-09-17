import { describe, expect, it } from "vitest";
import {
  bodyDensity,
  rankMatches,
  snippetFor,
  type DocsSearchItem,
} from "./docs-search-rank";

const ITEMS: DocsSearchItem[] = [
  {
    slug: "/docs/api/webhooks",
    label: "Webhooks",
    section: "API & AI",
    description: "Events, signatures and retries",
  },
  {
    slug: "/docs/rendering/draft-preview",
    label: "Draft Preview",
    section: "Rendering",
  },
  {
    slug: "/docs/api/rate-limits",
    label: "Rate limits",
    section: "API & AI",
  },
  {
    slug: "/docs/api/graphql",
    label: "GraphQL Delivery API",
    section: "API & AI",
  },
];

const BODIES = new Map<string, string>([
  [
    "/docs/api/webhooks",
    "A delivery that fails is retried with backoff. The webhook receiver should honour Retry-After.",
  ],
  [
    "/docs/rendering/draft-preview",
    "The draft secret is set on the workspace and sent as a query parameter.",
  ],
  [
    "/docs/api/rate-limits",
    "The delivery endpoint applies one rate limit per workspace, counted per minute.",
  ],
  [
    "/docs/api/graphql",
    "Every delivery caller shares one rate limit; a webhook does not consume it.",
  ],
]);

describe("rankMatches", () => {
  it("finds a page by a word that lives only in its body", () => {
    expect(
      rankMatches(ITEMS, BODIES, "draft secret").map((h) => h.slug),
    ).toEqual(["/docs/rendering/draft-preview"]);
  });

  it("puts the page named for the word above a page that merely mentions it", () => {
    const hits = rankMatches(ITEMS, BODIES, "webhook");
    expect(hits[0]?.slug).toBe("/docs/api/webhooks");
    expect(hits.map((h) => h.slug)).toContain("/docs/api/graphql");
  });

  it("ranks a title match above a body match for rate limits too", () => {
    const hits = rankMatches(ITEMS, BODIES, "rate limit");
    expect(hits[0]?.slug).toBe("/docs/api/rate-limits");
    expect(hits[1]?.slug).toBe("/docs/api/graphql");
  });

  it("carries a snippet on a body hit and none on a title hit", () => {
    const [titleHit] = rankMatches(ITEMS, BODIES, "rate limit");
    expect(BODIES.get("/docs/api/rate-limits")).toContain("rate limit");
    expect(titleHit?.slug).toBe("/docs/api/rate-limits");
    expect(titleHit?.snippet).toBeUndefined();

    const [bodyHit] = rankMatches(ITEMS, BODIES, "draft secret");
    expect(bodyHit?.snippet).toContain("draft secret");
  });

  it("puts a page named for the word above one that only describes it, even when its title is longer", () => {
    const items: DocsSearchItem[] = [
      {
        slug: "/docs/api/webhooks",
        label: "Webhook delivery, signatures and retries",
        section: "API & AI",
      },
      {
        slug: "/docs/editor/alerts",
        label: "Alerts",
        section: "Editor",
        description: "Webhook and email notifications for editors",
      },
    ];

    expect(rankMatches(items, new Map(), "webhook").map((h) => h.slug)).toEqual([
      "/docs/api/webhooks",
      "/docs/editor/alerts",
    ]);
  });

  it("prefers the more specific title when two hits are otherwise equal", () => {
    const items: DocsSearchItem[] = [
      {
        slug: "/docs/a-broader",
        label: "Cart and checkout configuration options",
        section: "Content",
      },
      { slug: "/docs/z-exact", label: "Cart", section: "Content" },
    ];

    expect(rankMatches(items, new Map(), "cart").map((h) => h.slug)).toEqual([
      "/docs/z-exact",
      "/docs/a-broader",
    ]);
  });

  it("requires every term, so an unrelated second word rules a page out", () => {
    expect(rankMatches(ITEMS, BODIES, "webhook zzz")).toEqual([]);
  });

  it("still works before the bodies have loaded", () => {
    const hits = rankMatches(ITEMS, new Map(), "webhook");
    expect(hits.map((h) => h.slug)).toEqual(["/docs/api/webhooks"]);
  });

  it("returns nothing for an empty query rather than everything", () => {
    expect(rankMatches(ITEMS, BODIES, "   ")).toEqual([]);
  });

  it("honours the limit", () => {
    expect(rankMatches(ITEMS, BODIES, "delivery", 2)).toHaveLength(2);
  });

  it("orders equal tiers the same way on every call", () => {
    const once = rankMatches(ITEMS, BODIES, "delivery").map((h) => h.slug);
    const twice = rankMatches([...ITEMS].reverse(), BODIES, "delivery").map(
      (h) => h.slug,
    );
    expect(once).toEqual(twice);
  });
});

describe("body ranking", () => {
  const items: DocsSearchItem[] = [
    { slug: "/docs/rendering/draft-preview", label: "Draft Preview", section: "Rendering" },
    { slug: "/docs/start/installation", label: "Installation", section: "Get Started" },
    { slug: "/docs/api/cli", label: "CLI", section: "API & AI" },
  ];

  it("puts the page that is about the words above the pages that pass them", () => {
    const long = "install the sdk and wire the app. ".repeat(120);
    const bodies = new Map([
      [
        "/docs/rendering/draft-preview",
        `The draft secret gates draft preview. ${"Set the draft secret on the workspace. ".repeat(6)}`,
      ],
      ["/docs/start/installation", `${long} Set CMSSY_DRAFT_SECRET in .env. ${long}`],
      ["/docs/api/cli", `${long} cmssy init writes the draft secret for you. ${long}`],
    ]);

    expect(rankMatches(items, bodies, "draft secret").map((h) => h.slug)).toEqual([
      "/docs/rendering/draft-preview",
      "/docs/start/installation",
      "/docs/api/cli",
    ]);
  });

  it("does not let a short label stand in for relevance", () => {
    const bodies = new Map([
      ["/docs/api/cli", `rate limit ${"filler ".repeat(400)}`],
      ["/docs/start/installation", `${"rate limit ".repeat(20)}`],
    ]);

    expect(
      rankMatches(items, bodies, "rate limit").map((h) => h.slug),
    ).toEqual(["/docs/start/installation", "/docs/api/cli"]);
  });
});

describe("bodyDensity", () => {
  it("counts every occurrence of every term, not just the first", () => {
    const body = `draft draft secret ${"x".repeat(1_000)}`;
    expect(bodyDensity(body, ["draft", "secret"])).toBeCloseTo(
      3 / body.length,
      10,
    );
  });

  it("floors short bodies, so a stub mentioning a word once cannot outrank a real page", () => {
    expect(bodyDensity("rate limit", ["rate", "limit"])).toBeCloseTo(2 / 1_000, 10);
  });
});

describe("snippetFor", () => {
  it("centres on the earliest term and marks both elisions", () => {
    const body = `${"pad ".repeat(40)}retry-after${" pad".repeat(40)}`;
    const snippet = snippetFor(body, ["retry-after"]);
    expect(snippet).toContain("retry-after");
    expect(snippet?.startsWith("…")).toBe(true);
    expect(snippet?.endsWith("…")).toBe(true);
  });

  it("does not mark an elision that did not happen", () => {
    expect(snippetFor("rate limits explained", ["rate"])).toBe(
      "rate limits explained",
    );
  });

  it("is undefined when no term is in the body", () => {
    expect(snippetFor("nothing here", ["absent"])).toBeUndefined();
  });
});
