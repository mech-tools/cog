import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting Hit Points.
 */
export default class HitPointsConfigSheet extends BaseConfigSheet {

  static DEFAULT_OPTIONS = {
    position: {
      width: 375,
    },
    config: {
      type: "hit-points",
    },
  };

  /** @override */
  static PARTS = {
    config: {
      id: "config",
      template: "systems/cog/templates/sheets/actor/config/hit-points-config.hbs",
    },
  };

  static {
    this._initializeConfigSheetClass();
  }

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /** @override */
  get title() {
    return game.i18n.format("COG.SHEET.CONFIG.HIT_POINTS.LABELS.Window_title", {
      name: this.document.name,
    });
  }

  /* -------------------------------------------- */
  /*  Sheet Context                               */
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    return {
      // Document
      systemFields: this.document.system.schema.fields.HEALTH.fields.hitPoints.fields,

      // Data
      HEALTH: this.#prepareHealth(),
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Health attributes on the actor sheet.
   * @returns {SCHEMA.ACTOR.HEALTH & SYSTEM.ACTOR.HEALTH}
   */
  #prepareHealth() {
    // Merge Data with System Config
    const health = this.getField("HEALTH");

    return health;
  }
}
