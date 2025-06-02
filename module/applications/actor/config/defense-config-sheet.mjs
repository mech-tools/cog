import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting a Defense.
 */
export default class DefenseConfigSheet extends BaseConfigSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    config: {
      type: "defense",
    },
  };

  /** @override */
  static PARTS = {
    config: {
      id: "config",
      template: "systems/cog/templates/sheets/actor/config/defense-config.hbs",
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
    return game.i18n.format("COG.CONFIG.DEFENSE.LABELS.Window_title", {
      defense: this.document.system.schema.getField(`defenses.${this.options.key}`).label,
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
      defense: {
        ...this.makeField(`defenses.${this.options.key}`),
        protection: {
          ...this.makeField(`defenses.${this.options.key}.protection`),
          base: this.makeField(`defenses.${this.options.key}.protection.base`),
          bonus: this.makeField(`defenses.${this.options.key}.protection.bonus`),
          max: this.makeField(`defenses.${this.options.key}.protection.max`),
        },
        reduction: {
          ...this.makeField(`defenses.${this.options.key}.reduction`),
          base: this.makeField(`defenses.${this.options.key}.reduction.base`),
          bonus: this.makeField(`defenses.${this.options.key}.reduction.bonus`),
          max: this.makeField(`defenses.${this.options.key}.reduction.max`),
        },
      },
    };
  }
}
