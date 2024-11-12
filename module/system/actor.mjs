/** @import {SYSTEM} from  "SYSTEM" */

import { Enum } from "../utils/_modules.mjs";

/* -------------------------------------------- */
/*  Enums & Config                              */
/* -------------------------------------------- */

/**
 * Allowed Hit Die types in the system.
 * @type {SYSTEM.ACTOR.HIT_DIE_TYPES}
 */
export const HIT_DIE_TYPES = new Enum({
  D6: { label: "SCHEMA.DICE.Die_6", value: "6" },
  D8: { label: "SCHEMA.DICE.Die_8", value: "8" },
  D10: { label: "SCHEMA.DICE.Die_10", value: "10" },
});

/* -------------------------------------------- */

/**
 * Possible types of Hit Die history.
 * @type {SYSTEM.ACTOR.HIT_DIE_LEVEL_TYPES}
 */
export const HIT_DIE_LEVEL_TYPES = new Enum({
  PROFILE: { label: "SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Profile", value: "PROFILE" },
  HITDIE: { label: "SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Hitdie", value: "HITDIE" },
  CON: { label: "SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Con", value: "CON" },
});

/* -------------------------------------------- */

/**
 * Possible sizes of an Actor.
 * @type {SYSTEM.ACTOR.SIZES}
 */
export const SIZES = new Enum({
  TINY: { label: "SCHEMA.ACTOR.SIZES.Tiny", value: 1 },
  VERY_SMALL: { label: "SCHEMA.ACTOR.SIZES.Very_small", value: 2 },
  SMALL: { label: "SCHEMA.ACTOR.SIZES.Small", value: 3 },
  MEDIUM: { label: "SCHEMA.ACTOR.SIZES.Medium", value: 4 },
  LARGE: { label: "SCHEMA.ACTOR.SIZES.Large", value: 5 },
  HUGE: { label: "SCHEMA.ACTOR.SIZES.Huge", value: 6 },
  GARGANTUAN: { label: "SCHEMA.ACTOR.SIZES.Gargantuan", value: 7 },
});

/* -------------------------------------------- */
/*  Helpers                                     */
/* -------------------------------------------- */

/**
 * Generate the Hit Die History.
 * @returns {SYSTEM.ACTOR.HIT_DIE_LEVEL_HISTORY}
 */
function generateHitDieLevelHistory() {
  const levels = {};

  for (let i = 1; i <= 20; i++) {
    const id = `level${i}`;
    const value_initial = null;
    const value_min = 0;
    const value_label = "SCHEMA.ACTOR.HIT_DIE.History.Level.Value_label";
    const value_labelData = { level: i };

    const isLevel1 = i === 1;
    const isLevelUpTo10 = i <= 10;
    const isEvenLevel = i % 2 === 0;

    const type = isLevel1
      ? HIT_DIE_LEVEL_TYPES.PROFILE
      : isLevelUpTo10 && isEvenLevel
        ? HIT_DIE_LEVEL_TYPES.HITDIE
        : HIT_DIE_LEVEL_TYPES.CON;

    const rollable = !isLevel1 && isEvenLevel && isLevelUpTo10;
    const value_hint = HIT_DIE_LEVEL_TYPES.label(type);

    levels[id] = {
      level: i,
      type,
      rollable,
      value_initial,
      value_min,
      value_label,
      value_labelData,
      value_hint,
    };
  }

  return levels;
}

/* -------------------------------------------- */
/*  Configuration Objects                       */
/* -------------------------------------------- */

/**
 * Health representation of an Actor.
 * @type {SYSTEM.ACTOR.HIT_DIE}
 */
export const HIT_DIE = Object.freeze({
  type: {
    label: "SCHEMA.ACTOR.HIT_DIE.Type.Label",
    value_initial: HIT_DIE_TYPES.D6,
    value_choices: HIT_DIE_TYPES.choices,
  },
  history: generateHitDieLevelHistory(),
});

/**
 * Health representation of an Actor.
 * @type {SYSTEM.ACTOR.HEALTH}
 */
export const HEALTH = Object.freeze({
  hitPoints: {
    label: "SCHEMA.ACTOR.HEALTH.Hit_points.Label",
    value_initial: 0,
    value_min: 0,
    base_initial: 0,
    base_min: 0,
  },
  tempDmgs: {
    label: "SCHEMA.ACTOR.HEALTH.Temp_dmgs.Label",
    value_initial: 0,
    value_min: 0,
    value_abbreviation: "SCHEMA.ACTOR.HEALTH.Temp_dmgs.Value_abbreviation",
  },
});

/* -------------------------------------------- */

/**
 * Advancement representation of an Actor.
 * @type {SYSTEM.ACTOR.ADVANCEMENT}
 */
export const ADVANCEMENT = Object.freeze({
  level: {
    label: "SCHEMA.ACTOR.ADVANCEMENT.Level.Label",
    value_min: 1,
    value_max: 20,
  },
  cr: {
    label: "SCHEMA.ACTOR.ADVANCEMENT.Cr.Label",
    value_initial: 0,
    value_min: 0,
    value_step: 0.5,
    value_hint: "SCHEMA.ACTOR.ADVANCEMENT.Cr.Value_hint",
  },
});

/* -------------------------------------------- */

/**
 * Size representation of an Asctor.
 * @type {SYSTEM.ACTOR.ATTRIBUTES}
 */
export const ATTRIBUTES = Object.freeze({
  size: {
    label: "SCHEMA.ACTOR.ATTRIBUTES.Size.Label",
    value_initial: SIZES.MEDIUM,
    value_choices: SIZES.choices,
    value_min: SIZES.TINY,
    value_max: SIZES.GARGANTUAN,
  },
});
