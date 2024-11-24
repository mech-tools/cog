import COGActorType from "./actor-type.mjs";

/**
 * Data schema, attributes, and methods specific to Npc type Actors.
 */
export default class COGNpc extends COGActorType {

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const required = { required: true, nullable: false };
    const schema = super.defineSchema();

    // advancement
    schema.advancement = new fields.SchemaField({
      cr: new fields.NumberField({ ...required, initial: 0, min: 0, step: 0.5 }),
    });

    // Remove unused fields by Npc
    for (const key of Object.keys(schema.abilities.fields)) {
      delete schema.abilities.fields[key].fields.bonus;
    }
    delete schema.health.fields.hitPoints.fields.bonus;
    for (const key of Object.keys(schema.attacks.fields)) {
      delete schema.attacks.fields[key].fields.bonus;
      delete schema.attacks.fields[key].fields.increases;
    }

    return schema;
  }

  /* -------------------------------------------- */
  /*  Data Preparation
  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAbilities() {
    for (const key of Object.keys(this.abilities)) {
      this.abilities[key].max = this.abilities[key].base;
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _prepareDerivedHealth() {
    this.health.hitPoints.max = this.health.hitPoints.base;

    super._prepareDerivedHealth();
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAttacks() {
    for (const key of Object.keys(this.attacks)) {
      this.attacks[key].max = this.attacks[key].base;
    }
  }
}
