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
      defenses: {
        ...this.makeField("defenses"),
        protection: {
          physical: {
            ...this.makeField("defenses.protection.physical"),
            base: this.makeField("defenses.protection.physical.base"),
            max: this.makeField("defenses.protection.physical.max"),
          },
          psy: {
            ...this.makeField("defenses.protection.psy"),
            base: this.makeField("defenses.protection.psy.base"),
            max: this.makeField("defenses.protection.psy.max"),
          },
        },
        reduction: {
          ...this.makeField("defenses.reduction"),
          base: this.makeField("defenses.reduction.base"),
          max: this.makeField("defenses.reduction.max"),
        },
      },
    };
  }
}
