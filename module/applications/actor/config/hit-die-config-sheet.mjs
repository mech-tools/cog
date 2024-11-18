import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting Hit Die.
 */
export default class HitDieConfigSheet extends BaseConfigSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: {
      width: 375,
      height: 400,
    },
    config: {
      type: "hit-die",
    },
  };

  /** @override */
  static PARTS = {
    config: {
      id: "config",
      template: "systems/cog/templates/sheets/actor/config/hit-die-config.hbs",
      scrollable: [".scrollable"],
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
    return game.i18n.format("COG.SHEET.CONFIG.HIT_DIE.LABELS.Window_title", {
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
      hitPoints: this.getField("health.hitPoints.base"),
      history: this.#prepareHistory(),
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Hie Die History on the Config sheet.
   * @returns {Array<string, typeof SYSTEM.ACTOR.hitDie.history>}
   */
  #prepareHistory() {
    // Get System metadata
    const history = this.getField("hitDie.history");

    // Remove entries that are under current Actor Level and reverse order
    return Object.entries(history)
      .filter(([key, lvl]) => lvl._mt.level <= this.document.system.advancement.level.value)
      .map(([key, lvl]) => {
        return [key, Object.assign(lvl, { isNull: lvl.value === null })];
      })
      .reverse();
  }
}
