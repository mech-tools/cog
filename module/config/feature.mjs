import { Enum } from "./api/_modules.mjs";

/**
 * Possible ranks of a feature.
 * @type {Enum<number>}
 */
export const FEATURE_RANKS = new Enum({
  RANK1: { label: "COG.FEATURE_RANKS.Rank1", value: 1 },
  RANK2: { label: "COG.FEATURE_RANKS.Rank2", value: 2 },
  RANK3: { label: "COG.FEATURE_RANKS.Rank3", value: 3 },
  RANK4: { label: "COG.FEATURE_RANKS.Rank4", value: 4 },
  RANK5: { label: "COG.FEATURE_RANKS.Rank5", value: 5 },
});
