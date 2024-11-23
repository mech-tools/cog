import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting an Ability.
 */
export default class AbilityConfigSheet extends BaseConfigSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: {
      width: 375,
    },
    config: {
      type: "ability",
    },
  };

  /** @override */
  static PARTS = {
    config: {
      id: "config",
      template: "systems/cog/templates/sheets/actor/config/ability-config.hbs",
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
    return game.i18n.format("COG.CONFIG.ABILITY.LABELS.Window_title", {
      ability: this.document.system.schema.getField(`abilities.${this.options.key}`).label,
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
      ability: {
        ...this.makeField(`abilities.${this.options.key}`),
        base: this.makeField(`abilities.${this.options.key}.base`),
        bonus: this.makeField(`abilities.${this.options.key}.bonus`),
        max: this.makeField(`abilities.${this.options.key}.max`),
      },
    };
  }
}
