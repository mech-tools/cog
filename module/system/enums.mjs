import { Enum } from "./api/_modules.mjs";

/* -------------------------------------------- */
/*  Enums                                       */
/* -------------------------------------------- */

/**
 * Allowed Hit Die types in the system.
 * @type {Enum<string>}
 */
export const HIT_DIE_TYPES = new Enum({
  D6: { label: "COG.SCHEMA.DICE.Die_6", value: "6" },
  D8: { label: "COG.SCHEMA.DICE.Die_8", value: "8" },
  D10: { label: "COG.SCHEMA.DICE.Die_10", value: "10" },
});

/* -------------------------------------------- */

/**
 * Possible types of Hit Die history.
 * @type {Enum<string>}
 */
export const HIT_DIE_LEVEL_TYPES = new Enum({
  PROFILE: { label: "COG.SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Profile", value: "PROFILE" },
  HITDIE: { label: "COG.SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Hitdie", value: "HITDIE" },
  CON: { label: "COG.SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Con", value: "CON" },
});

/* -------------------------------------------- */

/**
 * Possible sizes of an Actor.
 * @type {Enum<number>}
 */
export const SIZES = new Enum({
  TINY: { label: "COG.SCHEMA.ACTOR.SIZES.Tiny", value: 1 },
  VERY_SMALL: { label: "COG.SCHEMA.ACTOR.SIZES.Very_small", value: 2 },
  SMALL: { label: "COG.SCHEMA.ACTOR.SIZES.Small", value: 3 },
  MEDIUM: { label: "COG.SCHEMA.ACTOR.SIZES.Medium", value: 4 },
  LARGE: { label: "COG.SCHEMA.ACTOR.SIZES.Large", value: 5 },
  HUGE: { label: "COG.SCHEMA.ACTOR.SIZES.Huge", value: 6 },
  GARGANTUAN: { label: "COG.SCHEMA.ACTOR.SIZES.Gargantuan", value: 7 },
});
