/**
 * This class defines data schema, methods, and properties shared by all Item subtypes in the COG
 * system.
 */
export default class COGItemType extends foundry.abstract.TypeDataModel {

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;

    const schema = {};

    // Description
    schema.description = new fields.SchemaField({
      public: new fields.HTMLField(),
      secret: new fields.HTMLField(),
    });

    return schema;
  }

  /** @override */
  static LOCALIZATION_PREFIXES = ["COG.ITEM"];
}
