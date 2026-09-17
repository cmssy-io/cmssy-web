import { describe, expect, it } from "vitest";
import { fields } from "@cmssy/react";
import { harvestBlockText, joinPageText } from "./docs-search-text";

describe("harvestBlockText", () => {
  it("reads the field types a human writes sentences into", () => {
    const schema = {
      title: fields.text({ label: "Title" }),
      description: fields.textarea({ label: "Description" }),
      content: fields.richText({ label: "Content" }),
      notes: fields.markdown({ label: "Notes" }),
    };

    expect(
      harvestBlockText(schema, {
        title: "Draft preview",
        description: "How preview works",
        content: "<p>The draft secret</p>",
        notes: "Rotate it often",
      }),
    ).toBe("Draft preview How preview works The draft secret Rotate it often");
  });

  it("leaves out every field a reader would never type at", () => {
    const schema = {
      icon: fields.select({ label: "Icon", options: ["rocket", "shield"] }),
      href: fields.url({ label: "Href" }),
      colour: fields.color({ label: "Colour" }),
      featured: fields.boolean({ label: "Featured" }),
      order: fields.number({ label: "Order" }),
      cover: fields.media({ label: "Cover" }),
      target: fields.link({ label: "Target" }),
      owner: fields.email({ label: "Owner" }),
    };

    expect(
      harvestBlockText(schema, {
        icon: "rocket",
        href: "https://example.com/rocket",
        colour: "#ff0000",
        featured: true,
        order: 3,
        cover: { url: "https://example.com/rocket.png", alt: "rocket" },
        target: { label: "rocket", href: "/rocket" },
        owner: "rocket@example.com",
      }),
    ).toBe("");
  });

  it("descends into a repeater, because a props table is prose in rows", () => {
    const schema = {
      props: fields.repeater({
        label: "Properties",
        itemSchema: {
          name: fields.text({ label: "Name" }),
          description: fields.text({ label: "Description" }),
          required: fields.boolean({ label: "Required" }),
        },
      }),
    };

    expect(
      harvestBlockText(schema, {
        props: [
          {
            name: "retryAfter",
            description: "Seconds to wait",
            required: true,
          },
          {
            name: "limit",
            description: "Requests per minute",
            required: false,
          },
        ],
      }),
    ).toBe("retryAfter Seconds to wait limit Requests per minute");
  });

  it("keeps the word boundary a tag implied, so two paragraphs stay two words", () => {
    const schema = { content: fields.richText({ label: "Content" }) };

    expect(
      harvestBlockText(schema, {
        content: "<p>rate</p><p>limit</p>",
      }),
    ).toBe("rate limit");
  });

  it("decodes entities, so a reader searching for the character finds it", () => {
    const schema = { content: fields.richText({ label: "Content" }) };

    expect(
      harvestBlockText(schema, {
        content:
          "<code>a &amp; b</code> &lt;tag&gt; &#39;quoted&#39; &nbsp;end",
      }),
    ).toBe("a & b <tag> 'quoted' end");
  });

  it("returns nothing when the block type is unknown to this frontend", () => {
    expect(harvestBlockText(undefined, { title: "Orphaned" })).toBe("");
  });

  it("ignores a value whose shape disagrees with the schema", () => {
    const schema = {
      title: fields.text({ label: "Title" }),
      props: fields.repeater({
        label: "Props",
        itemSchema: { name: fields.text({ label: "Name" }) },
      }),
    };

    expect(
      harvestBlockText(schema, {
        title: { en: "nested" },
        props: "not a list",
      }),
    ).toBe("");
  });
});

describe("joinPageText", () => {
  it("caps one page, so a runaway block cannot make the payload unbounded", () => {
    const body = joinPageText(["word ".repeat(10_000)]);
    expect(body.length).toBe(20_000);
  });

  it("drops the blocks that carried no prose", () => {
    expect(joinPageText(["Rate limits", "", "  ", "Retry-After"])).toBe(
      "Rate limits Retry-After",
    );
  });
});
