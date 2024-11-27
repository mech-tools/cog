/**
 * This class defines data schema, methods, and properties shared by all Actor subtypes in the COG
 * system.
 */
export default class COGActorType extends foundry.abstract.TypeDataModel {

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };

    const schema = {};

    // Abilities
    const abilities = [
      "strength",
      "dexterity",
      "constitution",
      "intelligence",
      "perception",
      "charisma",
    ];

    schema.abilities = new fields.SchemaField(
      abilities.reduce((obj, id) => {
        obj[id] = new fields.SchemaField(
          {
            base: new fields.NumberField({
              ...requiredInteger,
              initial: 0,
              label: "COG.ACTOR.FIELDS.abilities.*.base.label",
              hint: "COG.ACTOR.FIELDS.abilities.*.base.hint",
            }),
            bonus: new fields.NumberField({
              ...requiredInteger,
              initial: 0,
              label: "COG.ACTOR.FIELDS.abilities.*.bonus.label",
              hint: "COG.ACTOR.FIELDS.abilities.*.bonus.hint",
            }),
            max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
          },
          { abbreviation: `COG.ACTOR.FIELDS.abilities.${id}.abbreviation` },
        );
        return obj;
      }, {}),
    );

    // Health Pool
    schema.health = new fields.SchemaField({
      hitPoints: new fields.SchemaField({
        base: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        bonus: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      }),
      tempDmgs: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        abbreviation: "COG.ACTOR.FIELDS.health.tempDmgs.abbreviation",
      }),
    });

    // Attributes
    schema.attributes = new fields.SchemaField({
      size: new fields.NumberField({
        ...requiredInteger,
        initial: COG.SIZES.MEDIUM,
        choices: COG.SIZES.choices,
        min: COG.SIZES.TINY,
        max: COG.SIZES.GARGANTUAN,
      }),
      initiative: new fields.SchemaField(
        {
          base: new fields.NumberField({ ...requiredInteger, initial: 0 }),
          bonus: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        },
        { abbreviation: "COG.ACTOR.FIELDS.attributes.initiative.abbreviation" },
      ),
      wounds: new fields.SchemaField({
        threshold: new fields.SchemaField({
          base: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          bonus: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        }),
        count: new fields.NumberField({
          ...requiredInteger,
          initial: 0,
          min: 0,
          pips: "COG.ACTOR.FIELDS.attributes.wounds.count.pips",
        }),
      }),
    });

    // Attacks
    schema.attacks = new fields.SchemaField(
      ["melee", "range", "psy"].reduce((obj, id) => {
        obj[id] = new fields.SchemaField({
          base: new fields.NumberField({
            ...requiredInteger,
            initial: 0,
            label: "COG.ACTOR.FIELDS.attacks.*.base.label",
          }),
          increases: new fields.NumberField({
            ...requiredInteger,
            initial: 0,
            min: 0,
            label: "COG.ACTOR.FIELDS.attacks.*.increases.label",
            hint: id !== "psy" && "COG.ACTOR.FIELDS.attacks.*.increases.hint",
          }),
          bonus: new fields.NumberField({
            ...requiredInteger,
            initial: 0,
            min: 0,
            label: "COG.ACTOR.FIELDS.attacks.*.bonus.label",
            hint: "COG.ACTOR.FIELDS.attacks.*.bonus.hint",
          }),
          max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        });
        return obj;
      }, {}),
    );

    return schema;
  }

  /** @override */
  static LOCALIZATION_PREFIXES = ["COG.ACTOR"];

  /* -------------------------------------------- */
  /*  Base Data Preparation
  /* -------------------------------------------- */

  /** @override */
  prepareBaseData() {
    this._prepareBaseAbilities();
    this._prepareBaseHealth();
    this._prepareBaseAttributes();
    this._prepareBaseAttacks();
    this._prepareBaseDefenses();
  }

  /* -------------------------------------------- */

  /**
   * Preparation of base abilities for all actor subtypes.
   * @override
   */
  _prepareBaseAbilities() {}

  /* -------------------------------------------- */

  /**
   * Preparation of base health for all actor subtypes.
   * @override
   */
  _prepareBaseHealth() {}

  /* -------------------------------------------- */

  /**
   * Preparation of base attributes for all actor subtypes.
   * @override
   */
  _prepareBaseAttributes() {}

  /* -------------------------------------------- */

  /**
   * Preparation of base attacks for all actor subtypes.
   * @override
   */
  _prepareBaseAttacks() {}

  /* -------------------------------------------- */

  /**
   * Preparation of base attacks for all actor subtypes.
   * @override
   */
  _prepareBaseDefenses() {}

  /* -------------------------------------------- */
  /*  Derived Data Preparation
  /* -------------------------------------------- */

  /** @override */
  prepareDerivedData() {
    this._prepareDerivedAbilities();
    this._prepareDerivedHealth();
    this._prepareDerivedAttributes();
    this._prepareDerivedAttacks();
    this._prepareDerivedDefenses();
  }

  /* -------------------------------------------- */

  /**
   * Preparation of derived abilities for all actor subtimes.
   * @override
   */
  _prepareDerivedAbilities() {}

  /* -------------------------------------------- */

  /**
   * Preparation of derived health for all actor subtypes.
   */
  _prepareDerivedHealth() {
    // Clamp Hit Points between 0 and max
    this.health.hitPoints.value = Math.clamp(
      this.health.hitPoints.value,
      0,
      this.health.hitPoints.max,
    );
  }

  /* -------------------------------------------- */

  /**
   * Preparation of derived abilities for all actor subtimes.
   * @override
   */
  _prepareDerivedAttributes() {}

  /* -------------------------------------------- */

  /**
   * Preparation of derived abilities for all actor subtimes.
   * @override
   */
  _prepareDerivedAttacks() {}

  /* -------------------------------------------- */

  /**
   * Preparation of derived abilities for all actor subtimes.
   * @override
   */
  _prepareDerivedDefenses() {}
}
