import * as ATTRIBUTES from "./attributes.mjs";
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
  SIZES: ATTRIBUTES.SIZES,
  INITIATIVE_BASE: ATTRIBUTES.INITIATIVE_BASE,
};
