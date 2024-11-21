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
  /*  Properties
  /* -------------------------------------------- */

  /** @override */
  get title() {
    return game.i18n.format("COG.CONFIG.HIT_DIE.LABELS.Window_title", {
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
      hitPoints: { base: this.makeField("health.hitPoints.base") },
      hitDie: { history: this.#prepareHistory() },
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Hie Die History on the Config sheet.
   * @returns {Record<
   *   string,
   *   { level: number; isNull: boolean; rollable: boolean; label: string; hint: string }
   * >}
   */
  #prepareHistory() {
    // Remove entries that are under current Actor Level and reverse order
    const history = Object.entries(this.document.system.hitDie.history)
      .filter(([level, value]) => parseInt(level) <= this.document.system.advancement.level)
      .reverse()
      .map(([level, value]) => {
        const obj = this.makeField(`hitDie.history.${level}`);

        obj.level = parseInt(level);
        obj.isNull = value === null;
        obj.rollable = obj.level % 2 === 0 && obj.level <= 10;
        obj.hint =
          obj.level === 1
            ? `${obj.field.hint}.profile`
            : obj.rollable
              ? `${obj.field.hint}.hitdie`
              : `${obj.field.hint}.con`;

        return obj;
      });

    return history;
  }
}
