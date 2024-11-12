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
      height: 400,
    },
    config: {
      type: "hit-die",
      includesHeader: { description: "SHEET.CONFIG.HIT_DIE.LABELS.Description" },
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

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    return {
      ...context,

      // Document
      systemFields: this.document.system.schema.fields.HIT_DIE.fields,

      // Data
      HISTORY: this.#prepareHistory(),
    };
  }

  /**
   * Prepare and format the display of Hie Die History on the Config sheet.
   * @returns {SCHEMA.ACTOR.HIT_DIE["history"] & SYSTEM.ACTOR.HIT_DIE["history"]}
   */
  #prepareHistory() {
    // Merge Data with System Config
    const data = foundry.utils.mergeObject(
      this.document.system.HIT_DIE.history,
      SYSTEM.ACTOR.HIT_DIE.history,
      {
        inplace: false,
      },
    );

    // Remove entries that are under current Actor Level and reverse order
    const history = Object.fromEntries(
      Object.entries(data)
        .filter(([key, value]) => value.level <= this.document.system.ADVANCEMENT.level.value)
        .map(([key, level]) => {
          return [key, Object.assign(level, { isNull: level.value === null })];
        })
        .reverse(),
    );

    return history;
  }
}
