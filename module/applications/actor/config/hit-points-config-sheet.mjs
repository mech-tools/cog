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
      // Data
      hitPoints: this.getField("health.hitPoints"),
    };
  }
}
