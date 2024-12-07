import { Enum } from "./api/_modules.mjs";

/**
 * Possible types of a Paths.
 * @type {Enum<string>}
 */
export const PATH_TYPES = new Enum({
  SPECIES: { label: "COG.PATH_TYPES.Species", value: "species" },
  CULTURAL: { label: "COG.PATH_TYPES.Cultural", value: "cultural" },
  EXPERTISE: { label: "COG.PATH_TYPES.Expertise", value: "expertise" },
});
