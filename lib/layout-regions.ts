import type { CmssyLayoutGroup } from "@cmssy/react";
import type { CmssyRegion } from "@cmssy/next";
import type { layout } from "@/cmssy/config";

export function regionHasBlocks(
  groups: CmssyLayoutGroup[],
  position: CmssyRegion<typeof layout>,
): boolean {
  return groups.some(
    (group) =>
      group.position === position &&
      group.blocks.some((block) => block.isActive),
  );
}
