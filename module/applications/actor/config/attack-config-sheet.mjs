import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Configuration application for adjusting an Attack.
 */
export default class AttackConfigSheet extends BaseConfigSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: {
      width: 375,
    },
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
  async _prepareContext(options) {
    return {
      // Sheet
      increases: this.#prepareIncreases(),

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

  /* -------------------------------------------- */

  /**
   * Compute the number of Increases avaiable for this actor.
   * @returns {number}
   */
  #prepareIncreases() {
    return Object.values(this.document.system.attacks).reduce(
      (count, { increases }) => count + increases,
      0,
    ) - this.document.system.advancement.level;
  }
}
