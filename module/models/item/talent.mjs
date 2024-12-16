import COGItemType from "./item-type.mjs";

/**
 * Data schema, attributes, and methods specific to Feature type Items.
 */
export default class COGTalent extends COGItemType {

  /** @override */
  static LOCALIZATION_PREFIXES = ["COG.ITEM", "COG.TALENT"];

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const required = { required: true, nullable: false };
    const schema = super.defineSchema();

    // Remove unused fields
    delete schema.description.fields.secret;

    return schema;
  }
}
