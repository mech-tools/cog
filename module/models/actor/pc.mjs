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
        Array.fromRange(20, 1).reduce((obj, level) => {
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

    // Resources
    schema.resources = new fields.SchemaField({
      luck: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      instability: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    });

    // Defenses
    schema.defenses = new fields.SchemaField(
      ["temp", "archaic", "firearm", "ionic", "laser", "plasma", "psy"].reduce((obj, id) => {
        obj[id] = new fields.SchemaField({
          protection: new fields.SchemaField(
            {
              base: new fields.NumberField({
                ...requiredInteger,
                initial: 0,
                label: "COG.ACTOR.FIELDS.defenses.*.protection.base.label",
                hint: id !== "psy" && "COG.ACTOR.FIELDS.defenses.*.protection.base.hint",
              }),
              bonus: new fields.NumberField({
                ...requiredInteger,
                initial: 0,
                label: "COG.ACTOR.FIELDS.defenses.*.protection.bonus.label",
                hint: "COG.ACTOR.FIELDS.defenses.*.protection.bonus.hint",
              }),
              max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
            },
            { label: "COG.ACTOR.FIELDS.defenses.*.protection.label" },
          ),
          reduction: new fields.SchemaField(
            {
              base: new fields.NumberField({
                ...requiredInteger,
                initial: 0,
                label: "COG.ACTOR.FIELDS.defenses.*.reduction.base.label",
                hint: id !== "temp" && "COG.ACTOR.FIELDS.defenses.*.reduction.base.hint",
              }),
              bonus: new fields.NumberField({
                ...requiredInteger,
                initial: 0,
                label: "COG.ACTOR.FIELDS.defenses.*.reduction.bonus.label",
                hint: "COG.ACTOR.FIELDS.defenses.*.reduction.bonus.hint",
              }),
              max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
            },
            { label: "COG.ACTOR.FIELDS.defenses.*.reduction.label" },
          ),
        });
        return obj;
      }, {}),
    );

    return schema;
  }

  /* -------------------------------------------- */
  /*  Base Data Preparation
  /* -------------------------------------------- */

  /** @override */
  _prepareBaseHealth() {
    this.health.hitPoints.base = Object.values(this.hitDie.history).reduce(
      (max, value) => max + value,
      0,
    );
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareBaseAttributes() {
    this.attributes.initiative.base =
      COG.BASE_INITIATIVE +
      this.abilities.dexterity.base +
      this.abilities.dexterity.bonus +
      this.abilities.perception.base +
      this.abilities.perception.bonus;

    this.attributes.wounds.threshold.base =
      COG.BASE_WOUND_THRESHOLD +
      this.abilities.constitution.base +
      this.abilities.constitution.bonus +
      this.abilities.strength.base +
      this.abilities.strength.bonus;
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareBaseAttacks() {
    this.attacks.melee.base = this.abilities.strength.base + this.abilities.strength.bonus;
    this.attacks.range.base = this.abilities.dexterity.base + this.abilities.dexterity.bonus;
    this.attacks.psy.base = this.abilities.perception.base + this.abilities.perception.bonus;
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareBaseDefenses() {
    for (const key in this.defenses) {
      switch (key) {
        case "psy":
          this.defenses[key].protection.base =
            COG.BASE_DEFENSE_PROTECTION +
            this.abilities.charisma.base +
            this.abilities.charisma.bonus;
          break;
        case "temp":
          this.defenses[key].reduction.base =
            this.abilities.strength.base + this.abilities.strength.bonus;
        // falls through
        default:
          this.defenses[key].protection.base =
            COG.BASE_DEFENSE_PROTECTION +
            this.abilities.dexterity.base +
            this.abilities.dexterity.bonus;
      }
    }
  }

  /* -------------------------------------------- */
  /*  Derived Data Preparation
  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAbilities() {
    for (const key in this.abilities) {
      this.abilities[key].max = this.abilities[key].base + this.abilities[key].bonus;
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _prepareDerivedHealth() {
    this.health.hitPoints.max = this.health.hitPoints.base + this.health.hitPoints.bonus;

    super._prepareDerivedHealth();
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAttributes() {
    this.attributes.initiative.max =
      this.attributes.initiative.base + this.attributes.initiative.bonus;

    this.attributes.wounds.threshold.max =
      this.attributes.wounds.threshold.base + this.attributes.wounds.threshold.bonus;
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAttacks() {
    for (const key in this.attacks) {
      this.attacks[key].max =
        this.attacks[key].base + this.attacks[key].increases + this.attacks[key].bonus;
    }
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedDefenses() {
    for (const key in this.defenses) {
      this.defenses[key].protection.max =
        this.defenses[key].protection.base + this.defenses[key].protection.bonus;

      this.defenses[key].reduction.max =
        this.defenses[key].reduction.base + this.defenses[key].reduction.bonus;
    }
  }
}
