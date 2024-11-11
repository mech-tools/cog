import * as ACTOR from "./actor.mjs";

export const SYSTEM_ID = "cog";

/* -------------------------------------------- */

/**
 * Include all constant definitions within the SYSTEM global export.
 */
export const SYSTEM = {
  id: SYSTEM_ID,

  ACTOR: {
    // Actor Enums
    HIT_DIE_TYPES: ACTOR.HIT_DIE_TYPES,
    SIZES: ACTOR.SIZES,
    HIT_DIE_LEVEL_TYPES: ACTOR.HIT_DIE_LEVEL_TYPES,

    // Actor Configuration Objects
    HIT_DIE: ACTOR.HIT_DIE,
    HEALTH: ACTOR.HEALTH,
    ADVANCEMENT: ACTOR.ADVANCEMENT,
    ATTRIBUTES: ACTOR.ATTRIBUTES,
  },
};
