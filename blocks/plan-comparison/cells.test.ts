import { describe, expect, it } from "vitest";
import type { PlanLimits } from "@/lib/plans";
import { cell, type Labels } from "./cells";

const labels: Labels = {
  unlimited: "Unlimited",
  included: "Included",
  excluded: "—",
};

const free: PlanLimits = {
  maxWorkspaces: 1,
  maxMembers: 1,
  maxPages: 5,
  maxStorageMb: 1024,
  maxUploadMb: 50,
  maxApiRequestsMonth: 100_000,
  maxBandwidthGbMonth: 50,
  maxOrdersMonth: 20,
  canUseSso: false,
};

const enterprise: PlanLimits = {
  ...free,
  maxWorkspaces: null,
  maxStorageMb: null,
  maxApiRequestsMonth: null,
  maxOrdersMonth: null,
  canUseSso: true,
};

describe("plan comparison cells", () => {
  it("marks bring-your-own AI key as included on every plan, free and paid alike", () => {
    for (const limits of [free, enterprise]) {
      expect(
        cell(limits, "byokAi", labels),
        "AI is BYOK only: no plan sells credits, every plan lets a workspace add its own provider key, so the row must read as included regardless of the plan's numeric limits.",
      ).toBe(labels.included);
    }
  });

  it("no longer knows the retired AI credits metric", () => {
    expect(
      cell(free, "aiCredits", labels),
      "A page still carrying the old aiCredits row must fall through to the excluded label rather than format a number the API no longer serves.",
    ).toBeNull();
  });

  it("formats counted limits and reads null as unlimited", () => {
    expect(cell(free, "apiRequests", labels)).toBe("100K");
    expect(cell(free, "storage", labels)).toBe("1 GB");
    expect(cell(free, "upload", labels)).toBe("50 MB");
    expect(cell(enterprise, "apiRequests", labels)).toBe(labels.unlimited);
    expect(cell(enterprise, "workspaces", labels)).toBe(labels.unlimited);
  });

  it("maps capability flags to the included and excluded labels", () => {
    expect(cell(free, "sso", labels)).toBe(labels.excluded);
    expect(cell(enterprise, "sso", labels)).toBe(labels.included);
  });

  it("caps orders a month and reads null as unlimited", () => {
    expect(cell(free, "orders", labels)).toBe("20");
    expect(cell(enterprise, "orders", labels)).toBe(labels.unlimited);
  });

  it("no longer knows the retired cart and branding rows, which every plan includes", () => {
    expect(cell(free, "cart", labels)).toBeNull();
    expect(cell(free, "removeBranding", labels)).toBeNull();
  });

  it("shows the upload ceiling in whole gigabytes", () => {
    expect(cell({ ...free, maxUploadMb: 2047 }, "upload", labels)).toBe(
      "2 GB",
    );
    expect(cell({ ...free, maxUploadMb: 30_720 }, "upload", labels)).toBe(
      "30 GB",
    );
  });
});
