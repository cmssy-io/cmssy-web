import { describe, expect, it } from "vitest";
import {
  CheckFailed,
  GALLERY_BLOCK,
  MINIMUM_RENDERED_CHARACTERS,
  demosFrom,
  renderedCharacters,
  verdictFor,
} from "./check-demos.mjs";

const body = (characters: number) => "a ".repeat(Math.ceil(characters / 2));
const page = (html: string) => ({ status: 200, html });

function grid(cards: Array<Record<string, unknown>>) {
  return [{ type: GALLERY_BLOCK, content: { cards } }];
}

describe("which demos the check reads off the published page", () => {
  it("takes every card the gallery lists", () => {
    expect(
      demosFrom(
        grid([
          { title: "Next", url: "https://one.example" },
          { title: "Astro", url: "https://two.example" },
        ]),
      ),
    ).toEqual([
      { title: "Next", url: "https://one.example" },
      { title: "Astro", url: "https://two.example" },
    ]);
  });

  it("reads cards from every gallery block on the page", () => {
    const two = [
      ...grid([{ title: "Next", url: "https://one.example" }]),
      ...grid([{ title: "Astro", url: "https://two.example" }]),
    ];

    expect(demosFrom(two).map((demo) => demo.url)).toEqual([
      "https://one.example",
      "https://two.example",
    ]);
  });

  it("ignores a block that is not the gallery", () => {
    const mixed = [
      { type: "cta", content: { cards: [{ url: "https://nope.example" }] } },
      ...grid([{ title: "Next", url: "https://one.example" }]),
    ];

    expect(demosFrom(mixed).map((demo) => demo.url)).toEqual([
      "https://one.example",
    ]);
  });

  it("refuses a page that carries no gallery", () => {
    expect(() => demosFrom([{ type: "cta", content: {} }], "/demos")).toThrow(
      CheckFailed,
    );
    expect(() => demosFrom([], "/demos")).toThrow(
      "/demos carries no docs-card-grid block",
    );
  });

  it("refuses a gallery whose cards were emptied", () => {
    expect(() => demosFrom(grid([]), "/demos")).toThrow("/demos lists no demos");
  });

  it("refuses a card with no url rather than skipping it", () => {
    expect(() =>
      demosFrom(
        grid([{ title: "Next", url: "https://one.example" }, { title: "Astro" }]),
        "/demos",
      ),
    ).toThrow("1 card(s) on /demos carry no url");
  });

  it("names a card that has no title", () => {
    expect(demosFrom(grid([{ url: "https://one.example" }]))[0].title).toBe(
      "(untitled)",
    );
  });
});

describe("what counts as a demo that still works", () => {
  it("passes a page that answered 200 and rendered", () => {
    expect(verdictFor(page(`<h1>Shop</h1><p>${body(2000)}</p>`))).toMatchObject({
      ok: true,
    });
  });

  it("fails anything that is not 200", () => {
    for (const status of [301, 404, 429, 500, 503]) {
      expect(verdictFor({ status, html: `<h1>x</h1>${body(2000)}` })).toEqual({
        ok: false,
        reason: `answered ${status}`,
      });
    }
  });

  it("fails a page that answered 200 with no heading", () => {
    const verdict = verdictFor(page(`<p>${body(2000)}</p>`));

    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toContain("no <h1>");
  });

  it("fails a page whose chrome renders but whose body does not", () => {
    const verdict = verdictFor(page(`<h1>Shop</h1><p>${body(100)}</p>`));

    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toContain("rendered almost nothing");
  });

  it("puts the floor between an empty shell and a real page", () => {
    const justUnder = `<h1>a</h1>${body(MINIMUM_RENDERED_CHARACTERS - 40)}`;
    const justOver = `<h1>a</h1>${body(MINIMUM_RENDERED_CHARACTERS + 40)}`;

    expect(verdictFor(page(justUnder)).ok).toBe(false);
    expect(verdictFor(page(justOver)).ok).toBe(true);
  });

  it("reports what it measured, whichever way it went", () => {
    expect(verdictFor(page(`<h1>a</h1>${body(2000)}`)).reason).toMatch(
      /\d+ rendered characters, 1 <h1>/,
    );
    expect(verdictFor(page(`<p>${body(2000)}</p>`)).reason).toMatch(
      /\d+ rendered characters, 0 <h1>/,
    );
  });
});

describe("counting what a reader would actually see", () => {
  it("counts text, not markup", () => {
    expect(renderedCharacters("<p><strong>four</strong></p>")).toBe(4);
  });

  it("does not count a script payload as rendered content", () => {
    const shell = `<h1>a</h1><script>${"x".repeat(5000)}</script>`;

    expect(renderedCharacters(shell)).toBeLessThan(
      MINIMUM_RENDERED_CHARACTERS,
    );
    expect(verdictFor(page(shell)).ok).toBe(false);
  });

  it("does not count styles or inline svg", () => {
    const shell = `<h1>a</h1><style>${"y".repeat(3000)}</style><svg>${"z".repeat(3000)}</svg>`;

    expect(renderedCharacters(shell)).toBeLessThan(
      MINIMUM_RENDERED_CHARACTERS,
    );
  });

  it("collapses whitespace instead of counting it", () => {
    expect(renderedCharacters("<p>a\n\n   \t b</p>")).toBe(3);
  });
});
