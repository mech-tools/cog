import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting Hit Points.
 */
export default class HitPointsConfigSheet extends BaseConfigSheet {

  static DEFAULT_OPTIONS = {
    position: {
      width: 400,
    },
    config: {
      type: "hit-points",
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
    return game.i18n.format("SHEET.CONFIG.HIT_POINTS.LABELS.Window_title", {
      name: this.document.name,
    });
  }
}
