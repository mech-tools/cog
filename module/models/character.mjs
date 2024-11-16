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
          initial: SYSTEM.ACTOR.HIT_DIE.type.value.initial,
          choices: SYSTEM.ACTOR.HIT_DIE.type.value.choices,
        }),
      }),
      history: new fields.SchemaField(
        Object.entries(SYSTEM.ACTOR.HIT_DIE.history).reduce((obj, [id, level]) => {
          obj[id] = new fields.SchemaField({
            value: new fields.NumberField({
              ...nullableInteger,
              initial: level.value.initial,
              min: level.value.min,
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
          initial: SYSTEM.ACTOR.ADVANCEMENT.level.value.min,
          min: SYSTEM.ACTOR.ADVANCEMENT.level.value.min,
          max: SYSTEM.ACTOR.ADVANCEMENT.level.value.max,
        }),
      }),
    });

    return schema;
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @override */
  _prepareBaseHealth() {
    // Compute base Hit Points based on Hit Die history
    this.HEALTH.hitPoints.base = Object.values(this.HIT_DIE.history).reduce(
      (max, level) => max + level.value,
      0,
    );

    super._prepareBaseHealth();
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedHealth() {

    // Compute max Hit Points based on base + bonus
    this.HEALTH.hitPoints.max = this.HEALTH.hitPoints.base + this.HEALTH.hitPoints.bonus;

    super._prepareDerivedHealth();
  }
}
