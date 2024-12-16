import * as ATTRIBUTES from "./attributes.mjs";
import * as PATH from "./path.mjs";
import * as ARCHETYPE from "./archetype.mjs";
import * as API from "./api/_modules.mjs";
import * as FEATURE from "./feature.mjs";

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
  ACTOR_BASE_INITIATIVE: ATTRIBUTES.ACTOR_BASE_INITIATIVE,
  ACTOR_BASE_WOUND_THRESHOLD: ATTRIBUTES.ACTOR_BASE_WOUND_THRESHOLD,
  ACTOR_BASE_DEFENSE_PROTECTION: ATTRIBUTES.ACTOR_BASE_DEFENSE_PROTECTION,
  FEATURE_RANKS: FEATURE.FEATURE_RANKS,
  PATH_TYPES: PATH.PATH_TYPES,
  ARCHETYPE_MODES: ARCHETYPE.ARCHETYPE_MODES,
  ARCHETYPE_CREATION_POINTS: ARCHETYPE.ARCHETYPE_CREATION_POINTS,
};
