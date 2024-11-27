import COGBaseActorSheet from "./base-actor-sheet.mjs";
import AbilityConfigSheet from "./config/ability-config-sheet.mjs";
import HitDieConfigSheet from "./config/hit-die-config-sheet.mjs";
import HitPointsConfigSheet from "./config/hit-points-config-sheet.mjs";
import AttackConfigSheet from "./config/attack-config-sheet.mjs";
import InitiativeConfigSheet from "./config/initiative-config-sheet.mjs";
import WoundThresholdConfigSheet from "./config/wound-threshold-config-sheet.mjs";
import DefenseConfigSheet from "./config/defense-config-sheet.mjs";

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
      initiative: InitiativeConfigSheet,
      woundThreshold: WoundThresholdConfigSheet,
      defense: DefenseConfigSheet,
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
      resources: {
        ...this.makeField("resources"),
        luck: this.makeField("resources.luck"),
        instability: this.makeField("resources.instability"),
      },
      defenses: this.#prepareDefenses(),
    };
  }

  /* -------------------------------------------- */

  /**
   * Tooltip creation according to pc level up status.
   * @returns {{ incomplete: boolean; details: string }}
   */
  #prepareLevelUp() {
    // Hit Die History
    const hitDieHistory = this.document.currentHitDieHistory
      .reduce((count, [, value]) => (!value ? count + 1 : count), 0);

    // Attacks increases
    const increasesDelta = this.document.increasesDelta;

    // Create the incomplete tooltip
    const incomplete = !!hitDieHistory || increasesDelta !== 0;

    let details = `<p>${game.i18n.localize("COG.ACTOR.LABELS.Creation_steps.Title")}</p><ul>`;

    if (hitDieHistory > 0) {
      const hitDieHistoryLabel = game.i18n.format("COG.ACTOR.LABELS.Creation_steps.Hit_die_count", {
        count: hitDieHistory,
      });
      details += `<li><span>${hitDieHistoryLabel}</span></li>`;
    }

    if (increasesDelta !== 0) {
      const increasesDeltaLabel = game.i18n.format(
        increasesDelta > 0
          ? "COG.ACTOR.LABELS.Creation_steps.Attacks_increases_count_too_many"
          : "COG.ACTOR.LABELS.Creation_steps.Attacks_increases_count_missing",
        {
          count: Math.abs(increasesDelta),
        },
      );
      details += `<li><span>${increasesDeltaLabel}</span></li>`;
    }

    details += "</ul>";

    return {
      incomplete,
      details,
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Defenses on the actor sheet.
   * @returns {{
   *   values: {
   *     any: {
   *       protection: { positive: boolean; pct: number; cssPct: string };
   *       reduction: { positive: boolean; pct: number; cssPct: string };
   *     };
   *   };
   * }}
   */
  #prepareDefenses() {
    const defenses = {
      ...this.makeField("defenses"),
      values: {},
    };

    for (const key of Object.keys(this.document.system.defenses)) {
      defenses.values[key] = {
        ...this.makeField(`defenses.${key}`),
        protection: { max: this.makeField(`defenses.${key}.protection.max`) },
        reduction: { max: this.makeField(`defenses.${key}.reduction.max`) },
      };
    }

    // Chart data
    const barCap = Math.max(
      ...Object.values(defenses.values).map(({ protection }) => protection.max.value),
      ...Object.values(defenses.values).map(({ reduction }) => reduction.max.value),
    );

    // Max css percentage is defined by CSS to 46.5%
    const cssCap = 46.5;

    for (const key of Object.keys(defenses.values)) {
      // Protection
      defenses.values[key].protection.positive = defenses.values[key].protection.max.value > 0;
      defenses.values[key].protection.pct = barCap
        ? Math.round((Math.abs(defenses.values[key].protection.max.value) * cssCap) / barCap)
        : 0;
      defenses.values[key].protection.cssPct = `--bar-pct: ${defenses.values[key].protection.pct}%`;

      // Reduction
      defenses.values[key].reduction.positive = defenses.values[key].reduction.max.value > 0;
      defenses.values[key].reduction.pct = barCap
        ? Math.round((Math.abs(defenses.values[key].reduction.max.value) * cssCap) / barCap)
        : 0;
      defenses.values[key].reduction.cssPct = `--bar-pct: ${defenses.values[key].reduction.pct}%`;
    }

    return defenses;
  }
}
