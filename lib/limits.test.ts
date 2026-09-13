import { describe, expect, it } from "vitest";
import { limitGroups, wordFor, type PublishedLimits } from "./limits";

function limit(
  name: string,
  group: string,
  extra: Partial<PublishedLimits["protection"][number]> = {},
) {
  return {
    name,
    group,
    resource: name,
    scope: "ip",
    unit: "requests",
    window: "minute",
    value: 10,
    configurable: false,
    ...extra,
  };
}

const published: PublishedLimits = {
  delivery: { perWorkspacePerMinute: 1200, perIpPerMinute: 600 },
  groups: ["delivery", "commerce"],
  protection: [
    limit("deliveryPerWorkspace", "delivery", { scope: "workspace" }),
    limit("cartMutations", "commerce", { scope: "session" }),
    limit("deliveryPerIp", "delivery"),
  ],
};

describe("wordFor", () => {
  it("gives the authored word for an API key", () => {
    expect(wordFor([{ key: "ip", label: "per IP address" }], "ip")).toBe(
      "per IP address",
    );
  });

  it("falls back to the key rather than printing nothing", () => {
    expect(wordFor([{ key: "ip", label: "   " }], "ip")).toBe("ip");
    expect(wordFor([], "quarter-hour")).toBe("quarter-hour");
    expect(wordFor(undefined, "levels")).toBe("levels");
  });
});

describe("limitGroups", () => {
  it("keeps the API's family order and collects each family's rows", () => {
    const groups = limitGroups(published, [
      { key: "commerce", label: "Cart and checkout" },
      { key: "delivery", label: "Delivery API", description: "Public reads." },
    ]);

    expect(groups.map((group) => group.key)).toEqual(["delivery", "commerce"]);
    expect(groups[0]?.label).toBe("Delivery API");
    expect(groups[0]?.description).toBe("Public reads.");
    expect(groups[0]?.limits.map((entry) => entry.name)).toEqual([
      "deliveryPerWorkspace",
      "deliveryPerIp",
    ]);
    expect(groups[1]?.limits.map((entry) => entry.name)).toEqual([
      "cartMutations",
    ]);
  });

  it("renders a family the API added after this page was authored", () => {
    const withNewFamily: PublishedLimits = {
      ...published,
      protection: [...published.protection, limit("quotasPerOrg", "quotas")],
    };

    const groups = limitGroups(withNewFamily, [
      { key: "delivery", label: "Delivery API" },
    ]);

    expect(groups.map((group) => group.key)).toEqual([
      "delivery",
      "commerce",
      "quotas",
    ]);
    expect(groups[groups.length - 1]?.label).toBe("quotas");
  });

  it("drops a family the API declares but has no guard for", () => {
    const declaredButEmpty: PublishedLimits = {
      ...published,
      groups: ["delivery", "commerce", "media"],
    };

    expect(limitGroups(declaredButEmpty, []).map((group) => group.key)).toEqual(
      ["delivery", "commerce"],
    );
  });

  it("renders nothing when the limits API could not be read", () => {
    expect(limitGroups(null, [{ key: "delivery", label: "Delivery" }])).toEqual(
      [],
    );
  });
});
