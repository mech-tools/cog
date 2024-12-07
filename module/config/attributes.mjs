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
export const ACTOR_SIZES = new Enum({
  TINY: { label: "COG.ACTOR_SIZES.Tiny", value: 1 },
  VERY_SMALL: { label: "COG.ACTOR_SIZES.Very_small", value: 2 },
  SMALL: { label: "COG.ACTOR_SIZES.Small", value: 3 },
  MEDIUM: { label: "COG.ACTOR_SIZES.Medium", value: 4 },
  LARGE: { label: "COG.ACTOR_SIZES.Large", value: 5 },
  HUGE: { label: "COG.ACTOR_SIZES.Huge", value: 6 },
  GARGANTUAN: { label: "COG.ACTOR_SIZES.Gargantuan", value: 7 },
});

/* -------------------------------------------- */

/**
 * Possible lifetyles of an Actor.
 * @type {Enum<string>}
 */
export const ACTOR_LIFESTYLES = new Enum({
  WRETCHED: { label: "COG.ACTOR_LIFESTYLES.Wretched", value: "wretched" },
  POOR: { label: "COG.ACTOR_LIFESTYLES.Poor", value: "poor" },
  MODEST: { label: "COG.ACTOR_LIFESTYLES.Modest", value: "modest" },
  COMFORTABLE: { label: "COG.ACTOR_LIFESTYLES.Comfortable", value: "comfortable" },
  WEALTHY: { label: "COG.ACTOR_LIFESTYLES.Wealthy", value: "wealthy" },
  OPULENT: { label: "COG.ACTOR_LIFESTYLES.Opulent", value: "opulent" },
});

/* -------------------------------------------- */

/**
 * The base threshold for initiative onto which bonuses are added.
 * @type {number}
 */
export const BASE_INITIATIVE = 10;

/* -------------------------------------------- */

/**
 * The base threshold for wounds onto which bonuses are added.
 * @type {number}
 */
export const BASE_WOUND_THRESHOLD = 10;

/* -------------------------------------------- */

/**
 * The base defense protection onto which bonuses are added.
 * @type {number}
 */
export const BASE_DEFENSE_PROTECTION = 10;
