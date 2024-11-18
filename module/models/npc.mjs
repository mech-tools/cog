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
    const schema = super.defineSchema();

    // advancement
    schema.advancement = new fields.SchemaField({
      cr: new fields.SchemaField({
        value: new fields.NumberField({
          ...SYSTEM.ACTOR.advancement.cr.value,
        }),
      }),
    });

    // Npc don't have Bonus HP
    delete schema.health.fields.hitPoints.fields.bonus;

    return schema;
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @override */
  _prepareBaseHealth() {
    super._prepareBaseHealth();
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedHealth() {
    this.health.hitPoints.max = this.health.hitPoints.base;

    super._prepareDerivedHealth();
  }
}
