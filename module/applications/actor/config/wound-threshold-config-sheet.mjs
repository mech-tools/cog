import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting the Wound Threshold.
 */
export default class WoundThresholdConfigSheet extends BaseConfigSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: {
      width: 375,
    },
    config: {
      type: "wound-threshold",
    },
  };

  /** @override */
  static PARTS = {
    config: {
      id: "config",
      template: "systems/cog/templates/sheets/actor/config/wound-threshold-config.hbs",
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
    return game.i18n.format("COG.CONFIG.WOUND_THRESHOLD.LABELS.Window_title", {
      name: this.document.name,
    });
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    return {
      // Data
      threshold: {
        ...this.makeField("attributes.wounds.threshold"),
        base: this.makeField("attributes.wounds.threshold.base"),
        bonus: this.makeField("attributes.wounds.threshold.bonus"),
        max: this.makeField("attributes.wounds.threshold.max"),
      },
    };
  }
}
