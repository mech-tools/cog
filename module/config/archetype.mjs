import { Enum } from "./api/_modules.mjs";

/**
 * Possible modes of a Archetypes.
 * @type {Enum<string>}
 */
export const ARCHETYPE_MODES = new Enum({
  SIMPLE: { label: "COG.ARCHETYPE_MODES.Simple", value: "simple" },
  ADVANCED: { label: "COG.ARCHETYPE_MODES.Advanced", value: "advanced" },
});

/* -------------------------------------------- */

/**
 * The number of creation points for the advanced archetype mode.
 * @type {number}
 */
export const ARCHETYPE_CREATION_POINTS = 8;
