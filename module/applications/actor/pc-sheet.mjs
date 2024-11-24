import COGBaseActorSheet from "./base-actor-sheet.mjs";
import AbilityConfigSheet from "./config/ability-config-sheet.mjs";
import HitDieConfigSheet from "./config/hit-die-config-sheet.mjs";
import HitPointsConfigSheet from "./config/hit-points-config-sheet.mjs";
import AttackConfigSheet from "./config/attack-config-sheet.mjs";

/**
 * A COGBaseActorSheet subclass used to configure Actors of the "pc" type.
 */
export default class PcSheet extends COGBaseActorSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {},
    actor: {
      type: "pc",
      includesActions: true,
      includesInventory: true,
      includesPaths: true,
      includesEffects: true,
      includesBiography: true,
    },
    configureProfiles: {
      ability: AbilityConfigSheet,
      hitDie: HitDieConfigSheet,
      hitPoints: HitPointsConfigSheet,
      attack: AttackConfigSheet,
    },
  };

  static {
    this._initializeActorSheetClass();
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    return {
      ...context,

      // Sheet
      levelUp: this.#prepareLevelUp(),

      // Data
      advancement: { level: this.makeField("advancement.level") },
      hitDie: {
        type: {
          ...this.makeField("hitDie.type"),
          icon: `systems/cog/ui/dice/${this.document.system.hitDie.type}.svg`,
        },
      },
    };
  }

  /* -------------------------------------------- */

  /**
   * Tooltip creation according to pc level up status.
   * @returns {{ incomplete: boolean; details: string }}
   */
  #prepareLevelUp() {
    // Hit Die History
    const hitDieHistory = Object.entries(this.document.system.hitDie.history)
      .reduce(
        (count, [level, value]) =>
          parseInt(level) <= this.actor.system.advancement.level && !value ? count + 1 : count,
        0,
      );

    // Attacks increases
    const attackIncreases =
      Object.values(this.document.system.attacks).reduce(
        (count, { increases }) => count + increases,
        0,
      ) - this.document.system.advancement.level;

    // Create the incomplete tooltip
    const incomplete = !!hitDieHistory || attackIncreases !== 0;

    let details = `<p>${game.i18n.localize("COG.ACTOR.LABELS.Creation_steps.Title")}</p><ul>`;

    if (hitDieHistory > 0) {
      const hitDieHistoryLabel = game.i18n.format("COG.ACTOR.LABELS.Creation_steps.Hit_die_count", {
        count: hitDieHistory,
      });
      details += `<li><span>${hitDieHistoryLabel}</span></li>`;
    }

    if (attackIncreases !== 0) {
      const baseLabel =
        attackIncreases > 0
          ? "COG.ACTOR.LABELS.Creation_steps.Attacks_increases_count_too_many"
          : "COG.ACTOR.LABELS.Creation_steps.Attacks_increases_count_missing";
      const attackIncreasesLabel = game.i18n.format(baseLabel, {
        count: Math.abs(attackIncreases),
      });
      details += `<li><span>${attackIncreasesLabel}</span></li>`;
    }

    details += "</ul>";

    return {
      incomplete,
      details,
    };
  }
}
