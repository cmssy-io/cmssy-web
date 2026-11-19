import { describe, expect, it } from "vitest";
import { buildSceneLabels, playableScene } from "./types";

describe("buildSceneLabels", () => {
  it("invents no content when the block stores none", () => {
    const labels = buildSceneLabels({});

    expect(labels.steps).toEqual([]);
    expect(labels.variants).toEqual([]);
    expect(labels.modelFields).toEqual([]);
    expect(labels.siteNav).toEqual([]);
    expect(labels.adminNav).toEqual([]);
    expect(labels.siteBrand).toBe("");
    expect(labels.siteHeadline).toBe("");
    expect(labels.agentName).toBe("");
    expect(labels.composerPlaceholder).toBe("");
  });

  it("keeps only the stored steps that can play", () => {
    const labels = buildSceneLabels({
      steps: [
        { prompt: "Bolder headline", target: "headline", text: "New" },
        { prompt: "No value", target: "headline" },
      ],
    });

    expect(labels.steps.map((s) => s.prompt)).toEqual(["Bolder headline"]);
  });
});

describe("playableScene", () => {
  const step = { prompt: "Bolder headline", target: "headline", text: "New" };

  it("has no scene without a step that can play", () => {
    expect(playableScene({})).toBeNull();
    expect(playableScene({ steps: [{ prompt: "No value" }] })).toBeNull();
  });

  it("hides the scene only on an explicit false", () => {
    expect(playableScene({ steps: [step], showScene: false })).toBeNull();
    expect(playableScene({ steps: [step] })?.steps).toHaveLength(1);
    expect(
      playableScene({ steps: [step], showScene: null })?.steps,
    ).toHaveLength(1);
  });
});
