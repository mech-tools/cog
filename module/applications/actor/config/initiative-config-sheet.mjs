import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting the Initiative.
 */
export default class InitiativeConfigSheet extends BaseConfigSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    config: {
      type: "initiative",
    },
  };

  /** @override */
  static PARTS = {
    config: {
      id: "config",
      template: "systems/cog/templates/sheets/actor/config/initiative-config.hbs",
    },
  };

  static {
    this._initializeConfigSheetClass();
  }

  /* -------------------------------------------- */
  /*  Properties
  /* -------------------------------------------- */

  /** @override */
  get title() {
    return game.i18n.format("COG.CONFIG.INITIATIVE.LABELS.Window_title", {
      name: this.document.name,
    });
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(_options) {
    return {
      // Data
      initiative: {
        ...this.makeField("attributes.initiative"),
        base: this.makeField("attributes.initiative.base"),
        bonus: this.makeField("attributes.initiative.bonus"),
        max: this.makeField("attributes.initiative.max"),
      },
    };
  }
}
