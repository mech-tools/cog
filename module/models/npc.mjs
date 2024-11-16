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
    const schema = super.defineSchema();

    // Advancement
    schema.ADVANCEMENT = new fields.SchemaField({
      cr: new fields.SchemaField({
        value: new fields.NumberField({
          ...required,
          initial: SYSTEM.ACTOR.ADVANCEMENT.cr.value.initial,
          min: SYSTEM.ACTOR.ADVANCEMENT.cr.value.min,
          step: SYSTEM.ACTOR.ADVANCEMENT.cr.value.step,
        }),
      }),
    });

    // Npc don't have Bonus HP
    delete schema.HEALTH.fields.hitPoints.fields.bonus;

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
    this.HEALTH.hitPoints.max = this.HEALTH.hitPoints.base;

    super._prepareDerivedHealth();
  }
}
