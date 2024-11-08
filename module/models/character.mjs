import COGActorType from "./actor-type.mjs";

/**
 * Data schema, attributes, and methods specific to Character type Actors.
 */
export default class COGCharacter extends COGActorType {

  /* -------------------------------------------- */
  /*  Data Schema                                 */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {

    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const nullableInteger = { required: true, nullable: true };
    const requiredString = { required: true, nullable: false };
    const schema = super.defineSchema();

    // Health Pool
    schema.health = new fields.SchemaField({
      [SYSTEM.ACTOR.HEALTH.hitPoints.id]: new fields.SchemaField({
        value: new fields.NumberField({
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
      [SYSTEM.ACTOR.HEALTH.hitDie.id]: new fields.SchemaField({
        value: new fields.StringField({
          ...requiredString,
          initial: SYSTEM.ACTOR.HEALTH.hitDie.initial,
          choices: SYSTEM.ACTOR.HEALTH.hitDie.choices,
        }),
        history: new fields.SchemaField(
          Object.values(SYSTEM.ACTOR.HEALTH.hitDie.history).reduce((obj, level) => {
            obj[level.id] = new fields.SchemaField({
              value: new fields.NumberField({ ...nullableInteger, initial: null, min: 0 }),
            });
            return obj;
          }, {}),
        ),
      }),
    });

    // Advancement
    schema.advancement = new fields.SchemaField({
      [SYSTEM.ACTOR.ADVANCEMENT.level.id]: new fields.SchemaField({
        value: new fields.NumberField({
          ...requiredInteger,
          initial: SYSTEM.ACTOR.ADVANCEMENT.level.min,
          min: SYSTEM.ACTOR.ADVANCEMENT.level.min,
          max: SYSTEM.ACTOR.ADVANCEMENT.level.max,
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
    this.health.hitPoints.max = Object.values(this.health.hitDie.history).reduce(
      (max, level) => max + level.value,
      0,
    );

    this.health.hitPoints.value = Math.clamp(
      this.health.hitPoints.value,
      0,
      this.health.hitPoints.max,
    );
  }
}
