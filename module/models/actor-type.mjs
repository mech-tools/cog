/** @import {SCHEMA} from  "MODELS" */

/**
 * This class defines data schema, methods, and properties shared by all Actor subtypes in the COG
 * system.
 */
export default class COGActorType extends foundry.abstract.TypeDataModel {

  /* -------------------------------------------- */
  /*  Data Schema                                 */
  /* -------------------------------------------- */

  /**
   * Define shared schema elements used by every Actor sub-type in COG. This method is extended by
   * subclasses to add type-specific fields.
   * @override
   */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };

    /** @type {SCHEMA.ACTOR} */
    const schema = {};

    // Attributes
    schema.attributes = new fields.SchemaField({
      [SYSTEM.ACTOR.ATTRIBUTES.size.id]: new fields.SchemaField({
        value: new fields.NumberField({
          ...requiredInteger,
          initial: SYSTEM.ACTOR.ATTRIBUTES.size.initial,
          choices: SYSTEM.ACTOR.ATTRIBUTES.size.choices,
          min: SYSTEM.ACTOR.ATTRIBUTES.size.min,
          max: SYSTEM.ACTOR.ATTRIBUTES.size.max,
        }),
      }),
    });

    return schema;
  }
}
