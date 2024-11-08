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

/**
 * Possible types of Hit Die history.
 * @type {SYSTEM.ACTOR.HIT_DIE_LEVEL_TYPES}
 */
export const HIT_DIE_LEVEL_TYPES = new Enum({
  HITDIE_CON: { label: "SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Hitdie_con", value: "HITDIE_CON" },
  HITDIE: { label: "SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Hitdie", value: "HITDIE" },
  CON: { label: "SCHEMA.ACTOR.HIT_DIE_LEVEL_TYPES.Con", value: "CON" },
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
    const label = "SCHEMA.ACTOR.HEALTH.HitDie.History.Level.Label";
    const labelData = { level: i };

    const isLevel1 = i === 1;
    const isLevelUpTo10 = i <= 10;
    const isEvenLevel = i % 2 === 0;

    const type = isLevel1
      ? HIT_DIE_LEVEL_TYPES.HITDIE_CON
      : isLevelUpTo10 && isEvenLevel
        ? HIT_DIE_LEVEL_TYPES.HITDIE
        : HIT_DIE_LEVEL_TYPES.CON;

    const rollable = !isLevel1 && isEvenLevel && isLevelUpTo10;
    const hint = HIT_DIE_LEVEL_TYPES.label(type);

    levels[id] = { id, level: i, type, rollable, label, labelData, hint };
  }

  return levels;
}

/* -------------------------------------------- */
/*  Configuration Objects                       */
/* -------------------------------------------- */

/**
 * Health representation of an Actor.
 * @type {SYSTEM.ACTOR.HEALTH}
 */
export const HEALTH = Object.freeze({
  hitPoints: {
    id: "hitPoints",
    label: "SCHEMA.ACTOR.HEALTH.HitPoints.Label",
  },
  tempDmgs: {
    id: "tempDmgs",
    label: "SCHEMA.ACTOR.HEALTH.TempDmgs.Label",
    abbreviation: "SCHEMA.ACTOR.HEALTH.TempDmgs.Abbreviation",
  },
  hitDie: {
    id: "hitDie",
    initial: HIT_DIE_TYPES.D6,
    choices: HIT_DIE_TYPES.choices,
    label: "SCHEMA.ACTOR.HEALTH.HitDie.Label",
    history: generateHitDieLevelHistory(),
  },
});

/* -------------------------------------------- */

/**
 * Advancement representation of an Actor.
 * @type {SYSTEM.ACTOR.ADVANCEMENT}
 */
export const ADVANCEMENT = Object.freeze({
  level: {
    id: "level",
    min: 1,
    max: 20,
    label: "SCHEMA.ACTOR.ADVANCEMENT.Level.Label",
  },
  cr: {
    id: "cr",
    step: 0.5,
    label: "SCHEMA.ACTOR.ADVANCEMENT.Cr.Label",
    hint: "SCHEMA.ACTOR.ADVANCEMENT.Cr.Hint",
  },
});

/* -------------------------------------------- */

/**
 * Size representation of an Asctor.
 * @type {SYSTEM.ACTOR.ATTRIBUTES}
 */
export const ATTRIBUTES = Object.freeze({
  size: {
    id: "size",
    initial: SIZES.MEDIUM,
    choices: SIZES.choices,
    min: SIZES.TINY,
    max: SIZES.GARGANTUAN,
    label: "SCHEMA.ACTOR.ATTRIBUTES.Size.Label",
  },
});
