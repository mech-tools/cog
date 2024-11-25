import COGBaseActorSheet from "./base-actor-sheet.mjs";

/**
 * A COGBaseActorSheet subclass used to configure Actors of the "npc" type.
 */
export default class NpcSheet extends COGBaseActorSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {},
    actor: {
      type: "npc",
      includesActions: true,
      includesEffects: true,
      includesBiography: true,
    },
    configureProfiles: {},
  };

  static {
    this._initializeActorSheetClass();
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    return {
      ...context,

      // Data
      advancement: { cr: this.makeField("advancement.cr") },
    };
  }
}
