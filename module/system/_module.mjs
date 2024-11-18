import * as ENUMS from "./enums.mjs";
import * as ACTOR from "./actor.mjs";
import * as API from "./api/_modules.mjs";

export const SYSTEM_ID = "cog";

/* -------------------------------------------- */

/**
 * Include all constant definitions within the SYSTEM global export.
 */
export const SYSTEM = {
  id: SYSTEM_ID,

  // Api
  API,

  // Enums
  ENUMS,

  // Types
  ACTOR: { ...ACTOR },
};
