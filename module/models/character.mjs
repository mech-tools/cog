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
    const schema = super.defineSchema();

    // Hit Die
    schema.hitDie = new fields.SchemaField({
      type: new fields.SchemaField({
        value: new fields.StringField({
          ...SYSTEM.ACTOR.hitDie.type.value,
        }),
      }),
      history: new fields.SchemaField(
        Object.entries(SYSTEM.ACTOR.hitDie.history).reduce((obj, [id, level]) => {
          obj[id] = new fields.SchemaField({
            value: new fields.NumberField({
              ...level.value,
            }),
          });
          return obj;
        }, {}),
      ),
    });

    // Advancement
    schema.advancement = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({
          ...SYSTEM.ACTOR.advancement.level.value,
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
    this.health.hitPoints.base = Object.values(this.hitDie.history).reduce(
      (max, level) => max + level.value,
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
