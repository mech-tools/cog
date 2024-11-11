/** @namespace SCHEMA */

/* -------------------------------------------- */
/*  Actor DataModel                             */
/* -------------------------------------------- */

/** @namespace ACTOR */

/**
 * @typedef {Object} SCHEMA.ACTOR
 * @property {SCHEMA.ACTOR.HIT_DIE}     [HIT_DIE]    The schema definition of Hit Die.
 * @property {SCHEMA.ACTOR.HEALTH}      HEALTH       The schema definition of Hit Points.
 * @property {SCHEMA.ACTOR.ADVANCEMENT} ADVANCEMENT  The schema definition of Advancement.
 * @property {SCHEMA.ACTOR.ATTRIBUTES}  ATTRIBUTES   The schema definition of Attributes.
 */

/**
 * @typedef {Object} SCHEMA.ACTOR.HIT_DIE
 * @property {{ value: number }} type
 * The schema definition of Hit Die.
 * @property {{ levels: Record<string, { value: number }> }} history
 * The schema definition of Health Points per level.
 */

/**
 * @typedef {Object} SCHEMA.ACTOR.HEALTH
 * @property {{ value: number; base: number; max: number }} hitPoints
 * The schema definition of Hit Points.
 * @property {{ value: number }} tempDmgs
 * The schema definition of Temporary Damages.
 */

/**
 * @typedef {Object} SCHEMA.ACTOR.ADVANCEMENT
 * @property {{ value: number }} [level]  The schema definition of PC Level.
 * @property {{ value: number }} [cr]     The schema definition of NPC CR.
 */

/**
 * @typedef {Object} SCHEMA.ACTOR.ATTRIBUTES
 * @property {{ value: number }} size  The schema definition of the Actor Size.
 */
