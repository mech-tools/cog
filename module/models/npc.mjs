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
    const requiredInteger = { ...required, integer: true };
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
    delete schema.attributes.fields.initiative.fields.bonus;
    delete schema.attributes.fields.wounds.fields.threshold.fields.bonus;
    for (const key of Object.keys(schema.attacks.fields)) {
      delete schema.attacks.fields[key].fields.bonus;
      delete schema.attacks.fields[key].fields.increases;
    }

    // Defenses
    schema.defenses = new fields.SchemaField({
      protection: new fields.SchemaField(
        ["physical", "psy"].reduce((obj, id) => {
          obj[id] = new fields.SchemaField({
            base: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
            max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          });
          return obj;
        }, {}),
      ),
      reduction: new fields.SchemaField({
        base: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
    });

    return schema;
  }

  /* -------------------------------------------- */
  /*  Derived Data Preparation
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
  _prepareDerivedAttributes() {
    this.attributes.initiative.max = this.attributes.initiative.base;
    this.attributes.wounds.threshold.max = this.attributes.wounds.threshold.base;
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAttacks() {
    for (const key of Object.keys(this.attacks)) {
      this.attacks[key].max = this.attacks[key].base;
    }
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedDefenses() {
    for (const key of Object.keys(this.defenses.protection)) {
      this.defenses.protection[key].max = this.defenses.protection[key].base;
    }

    this.defenses.reduction.max = this.defenses.reduction.base;
  }
}
