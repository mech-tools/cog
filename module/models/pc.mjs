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
            label: "COG.ACTOR.FIELDS.hitDie.history.*.label",
            hint: "COG.ACTOR.FIELDS.hitDie.history.*.hint",
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
    this.health.hitPoints.base = Object.values(this.hitDie.history).reduce(
      (max, value) => max + value,
      0,
    );
  }

  /** @override */
  _prepareBaseAttacks() {
    this.attacks.melee.base = this.abilities.strength.base + this.abilities.strength.bonus;
    this.attacks.range.base = this.abilities.dexterity.base + this.abilities.dexterity.bonus;
    this.attacks.psy.base = this.abilities.perception.base + this.abilities.perception.bonus;
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAbilities() {
    for (const key of Object.keys(this.abilities)) {
      this.abilities[key].max = this.abilities[key].base + this.abilities[key].bonus;
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _prepareDerivedHealth() {
    // Compute max Hit Points based on base + bonus
    this.health.hitPoints.max = this.health.hitPoints.base + this.health.hitPoints.bonus;

    super._prepareDerivedHealth();
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAttacks() {
    for (const key of Object.keys(this.attacks)) {
      this.attacks[key].max =
        this.attacks[key].base + this.attacks[key].increases + this.attacks[key].bonus;
    }
  }
}
