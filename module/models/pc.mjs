import COGActorType from "./actor-type.mjs";

/**
 * Data schema, attributes, and methods specific to pc type Actors.
 */
export default class COGPc extends COGActorType {

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {

    const fields = foundry.data.fields;
    const required = { required: true, nullable: false };
    const requiredInteger = { ...required, integer: true };
    const nullableInteger = { required: true, nullable: true };
    const schema = super.defineSchema();

    // Hit Die
    schema.hitDie = new fields.SchemaField({
      type: new fields.StringField({
        ...required,
        initial: COG.HIT_DIE_TYPES.D6,
        choices: COG.HIT_DIE_TYPES.choices,
      }),
      history: new fields.SchemaField(
        [...Array(20)].reduce((obj, value, index) => {
          const level = index + 1;
          obj[level] = new fields.NumberField({
            ...nullableInteger,
            initial: null,
            min: 0,
            label: "COG.ACTOR.FIELDS.hitDie.history.level.label",
            hint: "COG.ACTOR.FIELDS.hitDie.history.level.hint",
          });
          return obj;
        }, {}),
      ),
    });

    // Advancement
    schema.advancement = new fields.SchemaField({
      level: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1, max: 20 }),
    });

    return schema;
  }

  /* -------------------------------------------- */
  /*  Data Preparation
  /* -------------------------------------------- */

  /** @override */
  _prepareBaseHealth() {
    // Compute base Hit Points based on Hit Die history
    this.health.hitPoints.base = Object.values(this.hitDie.history).reduce(
      (max, value) => max + value,
      0,
    );

    super._prepareBaseHealth();
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedHealth() {

    // Compute max Hit Points based on base + bonus
    this.health.hitPoints.max = this.health.hitPoints.base + this.health.hitPoints.bonus;

    super._prepareDerivedHealth();
  }
}
