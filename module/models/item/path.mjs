import COGItemType from "./item-type.mjs";

/**
 * Data schema, attributes, and methods specific to Path type Items.
 */
export default class COGPath extends COGItemType {

  /** @override */
  static LOCALIZATION_PREFIXES = ["COG.ITEM", "COG.PATH"];

  /* -------------------------------------------- */
  /*  Properties
  /* -------------------------------------------- */

  /**
   * Return an object of string formatted tag data which describes this item.
   * @returns {Record<string, string>}
   */
  get tags() {
    return {
      type: COG.PATH_TYPES.choices[this.type],
    };
  }

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const required = { required: true, nullable: false };
    const schema = super.defineSchema();

    // Type
    schema.type = new fields.StringField({
      ...required,
      initial: COG.PATH_TYPES.SPECIES,
      choices: COG.PATH_TYPES.choices,
    });

    // Remove unused fields
    delete schema.description.fields.secret;

    return schema;
  }
}
