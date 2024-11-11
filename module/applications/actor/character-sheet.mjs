/** @import {SYSTEM} from  "SYSTEM" */
/** @import {SCHEMA} from  "MODELS" */

import COGBaseActorSheet from "./base-actor-sheet.mjs";
import HitDieConfigSheet from "./config/hit-die-config-sheet.mjs";

/**
 * A COGBaseActorSheet subclass used to configure Actors of the "character" type.
 */
export default class CharacterSheet extends COGBaseActorSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {},
    actor: {
      type: "character",
      includesActions: true,
      includesInventory: true,
      includesPaths: true,
      includesEffects: true,
      includesBiography: true,
    },
    configureProfiles: {
      hitDice: HitDieConfigSheet,
    },
  };

  static {
    this._initializeActorSheetClass();
  }

  /* -------------------------------------------- */
  /*  Sheet Context                               */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    return {
      ...context,

      // Sheet
      creationSteps: this.#prepareCreationSteps(),

      // Data
      HIT_DIE: this.#prepareHitDie(),
    };
  }

  /* -------------------------------------------- */

  /**
   * Tooltip creation according to character level up status.
   * @returns {{ incomplete: boolean; details: string }}
   */
  #prepareCreationSteps() {
    // Hit Die History
    const history = foundry.utils.mergeObject(
      this.document.system.HIT_DIE.history,
      SYSTEM.ACTOR.HIT_DIE.history,
      { inplace: false },
    );

    const hitDieHistory = Object.values(history)
      .reduce((count, { level, value }) => {
        return level <= this.actor.system.ADVANCEMENT.level.value && !value ? count + 1 : count;
      }, 0);

    // Create the tooltip
    const incomplete = !!hitDieHistory;
    let details = `<p>${game.i18n.localize("SHEET.ACTOR.LABELS.Creation_steps.Title")}</p><ul>`;

    if (hitDieHistory > 0) {
      const hitDieHistoryLabel = game.i18n.format(
        "SHEET.ACTOR.LABELS.Creation_steps.Hit_die_count",
        {
          count: hitDieHistory,
        },
      );
      details += `<li><span>${hitDieHistoryLabel}</span></li>`;
    }

    details += "</ul>";

    return {
      incomplete,
      details,
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Hit Die attributes on the character sheet.
   * @returns {SCHEMA.ACTOR.HIT_DIE & SYSTEM.ACTOR.HIT_DIE & { type: { icon: string } }}
   */
  #prepareHitDie() {
    // Merge Data with System Config
    const hitDie = foundry.utils.mergeObject(this.document.system.HIT_DIE, SYSTEM.ACTOR.HIT_DIE, {
      inplace: false,
    });

    // Icon
    hitDie.type.icon = `systems/cog/ui/dice/d${hitDie.type.value}.svg`;

    return hitDie;
  }
}
