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
      // Document
      systemFields: this.document.system.schema.fields.HIT_DIE.fields,

      // Data
      HIT_POINTS: { base: this.getField("HEALTH.hitPoints.base") },
      HISTORY: this.#prepareHistory(),
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Hie Die History on the Config sheet.
   * @returns {SCHEMA.ACTOR.HIT_DIE["history"] & SYSTEM.ACTOR.HIT_DIE["history"]}
   */
  #prepareHistory() {
    // Merge Data with System Config
    const history = this.getField("HIT_DIE.history");

    // Remove entries that are under current Actor Level and reverse order
    return Object.entries(history)
      .filter(([key, level]) => level.level <= this.document.system.ADVANCEMENT.level.value)
      .map(([key, level]) => {
        return [key, Object.assign(level, { isNull: level.value.value === null })];
      })
      .reverse();
  }
}
