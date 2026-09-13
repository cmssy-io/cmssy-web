import { describe, expect, it } from "vitest";
import { catalogueRows } from "./rows";

describe("catalogueRows", () => {
  it("orders the tools by name, whatever order they were written in", () => {
    const rows = catalogueRows([
      { name: "publish_page", permission: "pages:publish" },
      { name: "add_block_to_page", permission: "pages:edit" },
      { name: "list_models", permission: "models:view" },
    ]);

    expect(rows.map((row) => row.name)).toEqual([
      "add_block_to_page",
      "list_models",
      "publish_page",
    ]);
  });

  it("keeps a tool that requires no permission", () => {
    const rows = catalogueRows([
      { name: "get_workspace_info", description: "Reads the workspace." },
    ]);

    expect(rows).toEqual([
      {
        name: "get_workspace_info",
        permission: "",
        description: "Reads the workspace.",
      },
    ]);
  });

  it("drops a row the generator left without a name", () => {
    expect(
      catalogueRows([
        { name: "", permission: "pages:view" },
        { name: "   " },
        { permission: "pages:view" },
        { name: "get_page" },
      ]).map((row) => row.name),
    ).toEqual(["get_page"]);
  });

  it("trims what it renders, so a stray newline cannot break a cell", () => {
    expect(
      catalogueRows([
        { name: " get_page\n", permission: " pages:view ", description: " x " },
      ]),
    ).toEqual([
      { name: "get_page", permission: "pages:view", description: "x" },
    ]);
  });

  it("renders nothing when the block has no rows yet", () => {
    expect(catalogueRows(undefined)).toEqual([]);
    expect(catalogueRows([])).toEqual([]);
  });
});
