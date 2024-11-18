/**
 * This class defines data schema, methods, and properties shared by all Actor subtypes in the COG
 * system.
 */
export default class COGActorType extends foundry.abstract.TypeDataModel {

  /* -------------------------------------------- */
  /*  Data Schema                                 */
  /* -------------------------------------------- */

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    // Health Pool
    schema.health = new fields.SchemaField({
      hitPoints: new fields.SchemaField(
        Object.entries(SYSTEM.ACTOR.health.hitPoints).reduce((obj, [id, field]) => {
          if (foundry.utils.getType(field) !== "Object") return obj;
          obj[id] = new fields.NumberField({
            ...field,
          });
          return obj;
        }, {}),
      ),
      tempDmgs: new fields.SchemaField({
        value: new fields.NumberField({
          ...SYSTEM.ACTOR.health.tempDmgs.value,
        }),
      }),
    });

    // Attributes
    schema.attributes = new fields.SchemaField({
      size: new fields.SchemaField({
        value: new fields.NumberField({
          ...SYSTEM.ACTOR.attributes.size.value,
        }),
      }),
    });

    return schema;
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
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
