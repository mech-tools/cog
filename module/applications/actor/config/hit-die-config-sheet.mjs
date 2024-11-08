/** @import {SYSTEM} from  "SYSTEM" */
/** @import {SCHEMA} from  "MODELS" */

import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting Hit Die.
 */
export default class HitDieConfigSheet extends BaseConfigSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: {
      width: 375,
      height: 500,
    },
    config: {
      type: "hit-die",
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
    return game.i18n.format("SHEET.CONFIG.HIT_DIE.LABELS.Window_title", {
      name: this.document.name,
    });
  }

  /* -------------------------------------------- */
  /*  Sheet Context                               */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _prepareContext(_options) {
    return {
      // Document
      systemFields: this.document.system.schema.fields.health.fields.hitDie.fields,

      // Data
      history: this.#prepareHistory(),
    };
  }

  /**
   * Prepare and format the display of Hie Die History on the Config sheet.
   * @returns {SCHEMA.ACTOR.HEALTH["hitDie"]["history"] &
   *   SYSTEM.ACTOR.HEALTH["hitDie"]["history"]}
   */
  #prepareHistory() {
    // Merge Data with System Config
    let data = foundry.utils.mergeObject(
      this.document.system.health.hitDie.history,
      SYSTEM.ACTOR.HEALTH.hitDie.history,
      { inplace: false },
    );

    // Remove entries that are under current Actor Level and reverse order
    const history = Object.fromEntries(
      Object.entries(data)
        .filter(([key, value]) => value.level <= this.document.system.advancement.level.value)
        .reverse(),
    );

    return history;
  }
}
