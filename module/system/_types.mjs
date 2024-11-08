/** @namespace SYSTEM */

/* -------------------------------------------- */
/*  Actor Definition                            */
/* -------------------------------------------- */

/** @namespace ACTOR */

/** @typedef {Enum<string>} SYSTEM.ACTOR.HIT_DIE_TYPES */
/** @typedef {Enum<number>} SYSTEM.ACTOR.SIZES */
/** @typedef {Enum<string>} SYSTEM.ACTOR.HIT_DIE_LEVEL_TYPES */

/**
 * @typedef {Object} SYSTEM.ACTOR
 * @property {SYSTEM.ACTOR.HEALTH}      health       The system definition of Hit Points.
 * @property {SYSTEM.ACTOR.ADVANCEMENT} advancement  The system definition of Advancement.
 * @property {SYSTEM.ACTOR.ATTRIBUTES}  attributes   The system definition of Attributes.
 */

/**
 * @typedef {Record<
 *   string,
 *   {
 *     id: string;
 *     level: number;
 *     type: SYSTEM.ACTOR.HIT_DIE_LEVEL_TYPES;
 *     rollable: boolean;
 *     label: string;
 *     labelData: Record<string, any>;
 *     hint: string;
 *   }
 * >} SYSTEM.ACTOR.HIT_DIE_LEVEL_HISTORY
 */

/**
 * @typedef {Object} SYSTEM.ACTOR.HEALTH
 * @property {{
 *   id: string;
 *   label: string;
 *   configureLabel: string;
 * }} hitPoints
 * Actor hit points.
 * @property {{
 *   id: string;
 *   label: string;
 *   abbreviation: string;
 * }} tempDmgs
 * Actor temporary damages.
 * @property {{
 *   id: string;
 *   initial: string;
 *   choices: SYSTEM.ACTOR.HIT_DIE_TYPES;
 *   label: string;
 *   configureLabel: string;
 *   history: SYSTEM.ACTOR.HIT_DIE_LEVEL_HISTORY;
 * }} [hitDie]
 * Actor hit die (if exists)
 */

/**
 * @typedef {Object} SYSTEM.ACTOR.ADVANCEMENT
 * @property {{ id: string; min: number; max: number; label: string }} [level]
 * PC current level.
 * @property {{ id: string; step: number; label: string; hint: string }} [cr]
 * NPC current challenge rating.
 */

/**
 * @typedef {Object} SYSTEM.ACTOR.ATTRIBUTES
 * @property {{
 *   id: string;
 *   initial: number;
 *   choices: SYSTEM.ACTOR.SIZES;
 *   min: number;
 *   max: number;
 *   label: string;
 * }} size
 * Actor size.
 */
