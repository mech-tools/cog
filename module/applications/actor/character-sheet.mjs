import COGBaseActorSheet from "./base-actor-sheet.mjs";
import HitDieConfigSheet from "./config/hit-die-config-sheet.mjs";
import HitPointsConfigSheet from "./config/hit-points-config-sheet.mjs";

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
      hitDie: HitDieConfigSheet,
      hitPoints: HitPointsConfigSheet,
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
    const hitDieHistory = Object.values(history)
      .reduce((count, { level, value }) => {
        return level <= this.actor.system.ADVANCEMENT.level.value && !value.value
          ? count + 1
          : count;
      }, 0);

    // Create the tooltip
    const incomplete = !!hitDieHistory;
    let details = `<p>${game.i18n.localize("COG.SHEET.ACTOR.LABELS.Creation_steps.Title")}</p><ul>`;

    if (hitDieHistory > 0) {
      const hitDieHistoryLabel = game.i18n.format(
        "COG.SHEET.ACTOR.LABELS.Creation_steps.Hit_die_count",
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
    const hitDie = {
      type: this.getField("HIT_DIE.type"),
    };

    // Icon
    hitDie.type.icon = `systems/cog/ui/dice/d${hitDie.type.value.value}.svg`;

    return hitDie;
  }
}
