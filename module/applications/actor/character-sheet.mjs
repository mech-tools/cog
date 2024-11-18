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
      levelUp: this.#prepareLevelUp(),

      // Data
      hitDieType: this.#prepareHitDieType(),
    };
  }

  /* -------------------------------------------- */

  /**
   * Tooltip creation according to character level up status.
   * @returns {{ incomplete: boolean; details: string }}
   */
  #prepareLevelUp() {
    // Hit Die History
    const hitDieHistory = Object.values(this.getField("hitDie.history"))
      .reduce((count, lvl) => {
        return lvl._mt.level <= this.actor.system.advancement.level.value && !lvl.value
          ? count + 1
          : count;
      }, 0);

    // Create the incomplete tooltip
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
   * @returns {typeof SYSTEM.ACTOR.hitDie.type & { type: { icon: string } }}
   */
  #prepareHitDieType() {
    // Get System metadata
    const hitDieType = this.getField("hitDie.type");

    // Icon
    hitDieType.icon = `systems/cog/ui/dice/d${hitDieType.value}.svg`;

    return hitDieType;
  }
}
