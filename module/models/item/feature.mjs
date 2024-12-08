import COGItemType from "./item-type.mjs";

/**
 * Data schema, attributes, and methods specific to Feature type Items.
 */
export default class COGFeature extends COGItemType {

  /** @override */
  static LOCALIZATION_PREFIXES = ["COG.ITEM", "COG.FEATURE"];

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    const schema = super.defineSchema();

    // Remove unused fields
    delete schema.description.fields.secret;

    return schema;
  }
}
