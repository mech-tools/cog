import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting an Attack.
 */
export default class AttackConfigSheet extends BaseConfigSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    config: {
      type: "attack",
    },
  };

  /** @override */
  static PARTS = {
    config: {
      id: "config",
      template: "systems/cog/templates/sheets/actor/config/attack-config.hbs",
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
    return game.i18n.format("COG.CONFIG.ATTACK.LABELS.Window_title", {
      attack: this.document.system.schema.getField(`attacks.${this.options.key}`).label,
      name: this.document.name,
    });
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(_options) {
    return {
      // Sheet
      increasesDelta: this.document.system.increasesDelta,

      // Data
      attack: {
        ...this.makeField(`attacks.${this.options.key}`),
        base: this.makeField(`attacks.${this.options.key}.base`),
        increases: this.makeField(`attacks.${this.options.key}.increases`),
        bonus: this.makeField(`attacks.${this.options.key}.bonus`),
        max: this.makeField(`attacks.${this.options.key}.max`),
      },
    };
  }
}
