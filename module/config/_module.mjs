import * as ATTRIBUTES from "./attributes.mjs";
import * as PATH from "./path.mjs";
import * as API from "./api/_modules.mjs";

export const SYSTEM_ID = "cog";

/* -------------------------------------------- */

/**
 * Include all constant definitions within the COG global export.
 */
export const COG = {
  id: SYSTEM_ID,

  // Api
  API,

  // System definitions
  HIT_DIE_TYPES: ATTRIBUTES.HIT_DIE_TYPES,
  ACTOR_SIZES: ATTRIBUTES.ACTOR_SIZES,
  ACTOR_LIFESTYLES: ATTRIBUTES.ACTOR_LIFESTYLES,
  BASE_INITIATIVE: ATTRIBUTES.BASE_INITIATIVE,
  BASE_WOUND_THRESHOLD: ATTRIBUTES.BASE_WOUND_THRESHOLD,
  BASE_DEFENSE_PROTECTION: ATTRIBUTES.BASE_DEFENSE_PROTECTION,
  PATH_TYPES: PATH.PATH_TYPES,
};
