import COGBaseActorSheet from "./base-actor-sheet.mjs";
import HitDieConfigSheet from "./config/hit-die-config-sheet.mjs";

/**
 * A COGBaseActorSheet subclass used to configure Actors of the "character" type.
 */
export default class CharacterSheet extends COGBaseActorSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {},
    actor: {
      type: "character",
      includesActions: true,
      includesInventory: true,
      includesPaths: true,
      includesEffects: true,
      includesBiography: true,
    },
    configureProfiles: {
      hitDice: HitDieConfigSheet,
    },
  };

  static {
    this._initializeActorSheetClass();
  }
}
