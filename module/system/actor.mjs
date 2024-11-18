import { HIT_DIE_LEVEL_TYPES, HIT_DIE_TYPES, SIZES } from "./enums.mjs";

/* -------------------------------------------- */
/*  Helpers                                     */
/* -------------------------------------------- */

const required = { required: true, nullable: false };
const requiredInteger = { ...required, integer: true };
const nullableInteger = { required: true, nullable: true };
const requiredString = { ...required };

/**
 * Generate the Hit Die History.
 * @returns {Record<string, Object>}
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
        ...nullableInteger,
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
 * Hit Die representation of an Actor.
 */
export const hitDie = Object.freeze({
  type: {
    label: "COG.SCHEMA.ACTOR.HIT_DIE.Type.Label",
    value: {
      ...requiredString,
      initial: HIT_DIE_TYPES.D6,
      choices: HIT_DIE_TYPES.choices,
    },
  },
  history: generateHitDieLevelHistory(),
});

/**
 * Health representation of an Actor.
 */
export const health = Object.freeze({
  hitPoints: {
    label: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Label",
    value: {
      ...requiredInteger,
      initial: 0,
      min: 0,
    },

    base: {
      ...requiredInteger,
      initial: 0,
      min: 0,
      label: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Base.Label",
      hint: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Base.Hint",
    },

    bonus: {
      ...requiredInteger,
      initial: 0,
      min: 0,
      label: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Bonus.Label",
      hint: "COG.SCHEMA.ACTOR.HEALTH.HitPoints.Bonus.Hint",
    },

    max: {
      ...requiredInteger,
      initial: 0,
      min: 0,
    },
  },
  tempDmgs: {
    label: "COG.SCHEMA.ACTOR.HEALTH.TempDmgs.Label",
    value: {
      ...requiredInteger,
      initial: 0,
      min: 0,
      abbreviation: "COG.SCHEMA.ACTOR.HEALTH.TempDmgs.Value.Abbreviation",
    },
  },
});

/* -------------------------------------------- */

/**
 * Advancement representation of an Actor.
 */
export const advancement = Object.freeze({
  level: {
    label: "COG.SCHEMA.ACTOR.ADVANCEMENT.Level.Label",
    value: {
      ...requiredInteger,
      min: 1,
      max: 20,
    },
  },
  cr: {
    label: "COG.SCHEMA.ACTOR.ADVANCEMENT.Cr.Label",
    value: {
      ...required,
      initial: 0,
      min: 0,
      step: 0.5,
      hint: "COG.SCHEMA.ACTOR.ADVANCEMENT.Cr.Value.Hint",
    },
  },
});

/* -------------------------------------------- */

/**
 * Attributes representation of an Actor.
 */
export const attributes = Object.freeze({
  size: {
    label: "COG.SCHEMA.ACTOR.ATTRIBUTES.Size.Label",
    value: {
      ...requiredInteger,
      initial: SIZES.MEDIUM,
      choices: SIZES.choices,
      min: SIZES.TINY,
      max: SIZES.GARGANTUAN,
    },
  },
});
