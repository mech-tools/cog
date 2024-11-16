/** @import {SYSTEM} from  "SYSTEM" */

import { Enum } from "./api/_modules.mjs";

/* -------------------------------------------- */
/*  Enums & Config                              */
/* -------------------------------------------- */

/**
 * Allowed Hit Die types in the system.
 * @type {SYSTEM.ACTOR.HIT_DIE_TYPES}
 */
export const HIT_DIE_TYPES = new Enum({
  D6: { label: "COG.SCHEMA.DICE.Die_6", value: "6" },
  D8: { label: "COG.SCHEMA.DICE.Die_8", value: "8" },
  D10: { label: "COG.SCHEMA.DICE.Die_10", value: "10" },
});

/* -------------------------------------------- */

/**
 * Possible types of Hit Die history.
 * @type {SYSTEM.ACTOR.HIT_DIE_LEVEL_TYPES}
 */
export const HIT_DIE_LEVEL_TYPES = new Enum({
  PROFILE: { label: "COG.SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Profile", value: "PROFILE" },
  HITDIE: { label: "COG.SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Hitdie", value: "HITDIE" },
  CON: { label: "COG.SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Con", value: "CON" },
});

/* -------------------------------------------- */

/**
 * Possible sizes of an Actor.
 * @type {SYSTEM.ACTOR.SIZES}
 */
export const SIZES = new Enum({
  TINY: { label: "COG.SCHEMA.ACTOR.SIZES.Tiny", value: 1 },
  VERY_SMALL: { label: "COG.SCHEMA.ACTOR.SIZES.Very_small", value: 2 },
  SMALL: { label: "COG.SCHEMA.ACTOR.SIZES.Small", value: 3 },
  MEDIUM: { label: "COG.SCHEMA.ACTOR.SIZES.Medium", value: 4 },
  LARGE: { label: "COG.SCHEMA.ACTOR.SIZES.Large", value: 5 },
  HUGE: { label: "COG.SCHEMA.ACTOR.SIZES.Huge", value: 6 },
  GARGANTUAN: { label: "COG.SCHEMA.ACTOR.SIZES.Gargantuan", value: 7 },
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
    const initial = null;
    const min = 0;
    const label = "COG.SCHEMA.ACTOR.HIT_DIE.History.Level.Value.Label";
    const labelData = { level: i };

    const isLevel1 = i === 1;
    const isLevelUpTo10 = i <= 10;
    const isEvenLevel = i % 2 === 0;

    const type = isLevel1
      ? HIT_DIE_LEVEL_TYPES.PROFILE
      : isLevelUpTo10 && isEvenLevel
        ? HIT_DIE_LEVEL_TYPES.HITDIE
        : HIT_DIE_LEVEL_TYPES.CON;

    const rollable = !isLevel1 && isEvenLevel && isLevelUpTo10;
    const hint = HIT_DIE_LEVEL_TYPES.label(type);

    levels[id] = {
      level: i,
      type,
      rollable,
      value: {
        initial,
        min,
        label,
        labelData,
        hint,
      },
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
    value: {
      initial: HIT_DIE_TYPES.D6,
      choices: HIT_DIE_TYPES.choices,
      label: "COG.SCHEMA.ACTOR.HIT_DIE.Type.Value.Label",
    },
  },
  history: generateHitDieLevelHistory(),
});

/**
 * Health representation of an Actor.
 * @type {SYSTEM.ACTOR.HEALTH}
 */
export const HEALTH = Object.freeze({
  hitPoints: {
    value: {
      initial: 0,
      min: 0,
      label: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Value.Label",
    },

    base: {
      initial: 0,
      min: 0,
      label: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Base.Label",
      hint: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Base.Hint",
    },

    bonus: {
      initial: 0,
      min: 0,
      label: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Bonus.Label",
      hint: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Bonus.Hint",
    },

    max: {
      initial: 0,
      min: 0,
    },
  },
  tempDmgs: {
    value: {
      initial: 0,
      min: 0,
      label: "COG.SCHEMA.ACTOR.HEALTH.TempDmgs.Value.Label",
      abbreviation: "COG.SCHEMA.ACTOR.HEALTH.TempDmgs.Value.Abbreviation",
    },
  },
});

/* -------------------------------------------- */

/**
 * Advancement representation of an Actor.
 * @type {SYSTEM.ACTOR.ADVANCEMENT}
 */
export const ADVANCEMENT = Object.freeze({
  level: {
    value: {
      min: 1,
      max: 20,
      label: "COG.SCHEMA.ACTOR.ADVANCEMENT.Level.Value.Label",
    },
  },
  cr: {
    value: {
      initial: 0,
      min: 0,
      step: 0.5,
      label: "COG.SCHEMA.ACTOR.ADVANCEMENT.Cr.Value.Label",
      hint: "COG.SCHEMA.ACTOR.ADVANCEMENT.Cr.Value.Hint",
    },
  },
});

/* -------------------------------------------- */

/**
 * Size representation of an Asctor.
 * @type {SYSTEM.ACTOR.ATTRIBUTES}
 */
export const ATTRIBUTES = Object.freeze({
  size: {
    value: {
      initial: SIZES.MEDIUM,
      choices: SIZES.choices,
      min: SIZES.TINY,
      max: SIZES.GARGANTUAN,
      label: "COG.SCHEMA.ACTOR.ATTRIBUTES.Size.Value.Label",
    },
  },
});
