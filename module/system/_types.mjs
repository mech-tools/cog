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
 * @property {SYSTEM.ACTOR.HIT_DIE}     [HIT_DIE]    The system definition of Hit Die.
 * @property {SYSTEM.ACTOR.HEALTH}      HEALTH       The system definition of Hit Points.
 * @property {SYSTEM.ACTOR.ADVANCEMENT} ADVANCEMENT  The system definition of Advancement.
 * @property {SYSTEM.ACTOR.ATTRIBUTES}  ATTRIBUTES   The system definition of Attributes.
 */

/**
 * @typedef {Record<
 *   string,
 *   {
 *     level: number;
 *     type: SYSTEM.ACTOR.HIT_DIE_LEVEL_TYPES;
 *     rollable: boolean;
 *     value_initial: null;
 *     value_min: number;
 *     value_label: string;
 *     value_labelData: Record<string, any>;
 *     value_hint: string;
 *   }
 * >} SYSTEM.ACTOR.HIT_DIE_LEVEL_HISTORY
 */

/**
 * @typedef {Object} SYSTEM.ACTOR.HIT_DIE
 * @property {{
 *   value_initial: string;
 *   value_choices: SYSTEM.ACTOR.HIT_DIE_TYPES;
 *   value_label: string;
 * }} type
 * Type of Hit Die for the current actor.
 * @property {SYSTEM.ACTOR.HIT_DIE_LEVEL_HISTORY} history
 * History of Hit Points for all levels.
 */

/**
 * @typedef {Object} SYSTEM.ACTOR.HEALTH
 * @property {{
 *   value_initial: number;
 *   value_min: number;
 *   value_label: string;
 *   base_initial: number;
 *   base_choices: number;
 * }} hitPoints
 * Actor hit points.
 * @property {{
 *   value_initial: number;
 *   value_min: number;
 *   value_label: string;
 *   value_abbreviation: string;
 * }} tempDmgs
 * Actor temporary damages.
 */

/**
 * @typedef {Object} SYSTEM.ACTOR.ADVANCEMENT
 * @property {{ value_min: number; value_max: number; value_label: string }} [level]
 * PC current level.
 * @property {{
 *   value_initial: number;
 *   value_min: number;
 *   value_step: number;
 *   value_label: string;
 *   value_hint: string;
 * }} [cr]
 * NPC current challenge rating.
 */

/**
 * @typedef {Object} SYSTEM.ACTOR.ATTRIBUTES
 * @property {{
 *   value_initial: number;
 *   value_choices: SYSTEM.ACTOR.SIZES;
 *   value_min: number;
 *   value_max: number;
 *   value_label: string;
 * }} size
 * Actor size.
 */
