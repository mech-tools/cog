/** @namespace SCHEMA */

/* -------------------------------------------- */
/*  Actor DataModel                             */
/* -------------------------------------------- */

/** @namespace ACTOR */

/**
 * @typedef {Object} SCHEMA.ACTOR
 * @property {SCHEMA.ACTOR.HEALTH}      health       The schema definition of Hit Points.
 * @property {SCHEMA.ACTOR.ADVANCEMENT} advancement  The schema definition of Advancement.
 * @property {SCHEMA.ACTOR.ATTRIBUTES}  attributes   The schema definition of Attributes.
 */

/**
 * @typedef {Object} SCHEMA.ACTOR.HEALTH
 * @property {{ value: number; max: number }} hitPoints
 * The schema definition of Hit Points.
 * @property {{ value: number }} tempDmgs
 * The schema definition of Temporary Damages.
 * @property {{
 *   history: { levels: Record<string, { value: number }> };
 * }} [hitDie]
 * The schema definition of a Hit Die.
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
