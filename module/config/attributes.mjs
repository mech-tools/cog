import { Enum } from "./api/_modules.mjs";

/**
 * Allowed Hit Die types in the system.
 * @type {Enum<string>}
 */
export const HIT_DIE_TYPES = new Enum({
  D6: { label: "COG.DICE.D6", value: "d6" },
  D8: { label: "COG.DICE.D8", value: "d8" },
  D10: { label: "COG.DICE.D10", value: "d10" },
});

/* -------------------------------------------- */

/**
 * Possible sizes of an Actor.
 * @type {Enum<number>}
 */
export const SIZES = new Enum({
  TINY: { label: "COG.SIZES.Tiny", value: 1 },
  VERY_SMALL: { label: "COG.SIZES.Very_small", value: 2 },
  SMALL: { label: "COG.SIZES.Small", value: 3 },
  MEDIUM: { label: "COG.SIZES.Medium", value: 4 },
  LARGE: { label: "COG.SIZES.Large", value: 5 },
  HUGE: { label: "COG.SIZES.Huge", value: 6 },
  GARGANTUAN: { label: "COG.SIZES.Gargantuan", value: 7 },
});

/* -------------------------------------------- */

/**
 * The base threshold for initiative onto which bonuses are added.
 * @type {number}
 */
export const INITIATIVE_BASE = 10;
