import COGActorType from "./actor-type.mjs";

/**
 * Data schema, attributes, and methods specific to Npc type Actors.
 */
export default class COGNpc extends COGActorType {

  /* -------------------------------------------- */
  /*  Data Schema                                 */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const required = { required: true, nullable: false };
    const requiredInteger = { ...required, integer: true };
    const schema = super.defineSchema();

    // Health Pool
    schema.health = new fields.SchemaField({
      [SYSTEM.ACTOR.HEALTH.hitPoints.id]: new fields.SchemaField({
        value: new fields.NumberField({
          ...requiredInteger,
          initial: 0,
          min: 0,
        }),
        max: new fields.NumberField({
          ...requiredInteger,
          initial: 0,
          min: 0,
        }),
      }),
      [SYSTEM.ACTOR.HEALTH.tempDmgs.id]: new fields.SchemaField({
        value: new fields.NumberField({
          ...requiredInteger,
          initial: 0,
          min: 0,
        }),
      }),
    });

    // Advancement
    schema.advancement = new fields.SchemaField({
      [SYSTEM.ACTOR.ADVANCEMENT.cr.id]: new fields.SchemaField({
        value: new fields.NumberField({
          ...required,
          initial: 0,
          min: 0,
          step: SYSTEM.ACTOR.ADVANCEMENT.cr.step,
        }),
      }),
    });

    return schema;
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /**
   * Derived data preparation workflows used by all Actor subtypes.
   * @override
   */
  prepareDerivedData() {
    this.health.hitPoints.max = 10;
    this.health.hitPoints.value = Math.clamp(
      this.health.hitPoints.value,
      0,
      this.health.hitPoints.max,
    );
  }
}
