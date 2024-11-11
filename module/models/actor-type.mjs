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

    // Health Pool
    schema.HEALTH = new fields.SchemaField({
      hitPoints: new fields.SchemaField({
        value: new fields.NumberField({
          ...requiredInteger,
          initial: SYSTEM.ACTOR.HEALTH.hitPoints.value_initial,
          min: SYSTEM.ACTOR.HEALTH.hitPoints.value_min,
        }),
        base: new fields.NumberField({
          ...requiredInteger,
          initial: SYSTEM.ACTOR.HEALTH.hitPoints.base_initial,
          min: SYSTEM.ACTOR.HEALTH.hitPoints.base_min,
        }),
      }),
      tempDmgs: new fields.SchemaField({
        value: new fields.NumberField({
          ...requiredInteger,
          initial: SYSTEM.ACTOR.HEALTH.tempDmgs.value_initial,
          min: SYSTEM.ACTOR.HEALTH.tempDmgs.value_min,
        }),
      }),
    });

    // Attributes
    schema.ATTRIBUTES = new fields.SchemaField({
      size: new fields.SchemaField({
        value: new fields.NumberField({
          ...requiredInteger,
          initial: SYSTEM.ACTOR.ATTRIBUTES.size.value_initial,
          choices: SYSTEM.ACTOR.ATTRIBUTES.size.value_choices,
          min: SYSTEM.ACTOR.ATTRIBUTES.size.value_min,
          max: SYSTEM.ACTOR.ATTRIBUTES.size.value_max,
        }),
      }),
    });

    return schema;
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @override */
  prepareBaseData() {
    this._prepareBaseHealth();
  }

  /* -------------------------------------------- */

  /**
   * Preparation of base health for all actor subtypes.
   */
  _prepareBaseHealth() {}

  /* -------------------------------------------- */

  /** @override */
  prepareDerivedData() {
    this._prepareDerivedHealth();
  }

  /* -------------------------------------------- */

  /**
   * Preparation of derived health for all actor subtypes.
   */
  _prepareDerivedHealth() {
    // Clamp Hit Points between 0 and max
    this.HEALTH.hitPoints.value = Math.clamp(
      this.HEALTH.hitPoints.value,
      0,
      this.HEALTH.hitPoints.max,
    );
  }
}
