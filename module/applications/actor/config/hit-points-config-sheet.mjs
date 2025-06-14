import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting Hit Points.
 */
export default class HitPointsConfigSheet extends BaseConfigSheet {

  static DEFAULT_OPTIONS = {
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
  /*  Properties
  /* -------------------------------------------- */

  /** @override */
  get title() {
    return game.i18n.format("COG.CONFIG.HIT_POINTS.LABELS.Window_title", {
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
      hitPoints: {
        base: this.makeField("health.hitPoints.base"),
        bonus: this.makeField("health.hitPoints.bonus"),
        max: this.makeField("health.hitPoints.max"),
      },
    };
  }
}
