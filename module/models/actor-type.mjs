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

    // Health Pool
    schema.health = new fields.SchemaField({
      hitPoints: new fields.SchemaField({
        base: new fields.NumberField({ ...requiredInteger, initial: 0, value: 0 }),
        bonus: new fields.NumberField({ ...requiredInteger, initial: 0, value: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0, value: 0 }),
        value: new fields.NumberField({ ...requiredInteger, initial: 0, value: 0 }),
      }),
      tempDmgs: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        value: 0,
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
    });

    return schema;
  }

  /** @override */
  static LOCALIZATION_PREFIXES = ["COG.ACTOR"];

  /* -------------------------------------------- */
  /*  Data Preparation
  /* -------------------------------------------- */

  /** @override */
  prepareBaseData() {
    this._prepareBaseHealth();
  }

  /* -------------------------------------------- */

  /**
   * Preparation of base health for all actor subtypes.
   */
  _prepareBaseHealth() {}

  /* -------------------------------------------- */

  /** @override */
  prepareDerivedData() {
    this._prepareDerivedHealth();
  }

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
}
