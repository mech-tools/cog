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

    // Hit Die
    schema.HIT_DIE = new fields.SchemaField({
      type: new fields.SchemaField({
        value: new fields.StringField({
          ...requiredString,
          initial: SYSTEM.ACTOR.HIT_DIE.type.value_initial,
          choices: SYSTEM.ACTOR.HIT_DIE.type.value_choices,
        }),
      }),
      history: new fields.SchemaField(
        Object.entries(SYSTEM.ACTOR.HIT_DIE.history).reduce((obj, [id, level]) => {
          obj[id] = new fields.SchemaField({
            value: new fields.NumberField({
              ...nullableInteger,
              initial: level.value_initial,
              min: level.value_min,
            }),
          });
          return obj;
        }, {}),
      ),
    });

    // Advancement
    schema.ADVANCEMENT = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({
          ...requiredInteger,
          initial: SYSTEM.ACTOR.ADVANCEMENT.level.value_min,
          min: SYSTEM.ACTOR.ADVANCEMENT.level.value_min,
          max: SYSTEM.ACTOR.ADVANCEMENT.level.value_max,
        }),
      }),
    });

    // Characters have their base HP derived from Hit Die History
    delete schema.HEALTH.fields.hitPoints.fields.base;

    return schema;
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @override */
  _prepareBaseHealth() {
    // Compute max Hit Points based on Hit Die history
    this.HEALTH.hitPoints.base = Object.values(this.HIT_DIE.history).reduce(
      (max, level) => max + level.value,
      0,
    );

    super._prepareBaseHealth();
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedHealth() {
    this.HEALTH.hitPoints.max = this.HEALTH.hitPoints.base;

    super._prepareDerivedHealth();
  }
}
