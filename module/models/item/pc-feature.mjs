import COGItemType from "./item-type.mjs";

/**
 * Data schema, attributes, and methods specific to Feature type Items.
 */
export default class COGPcFeature extends COGItemType {

  /** @override */
  static LOCALIZATION_PREFIXES = ["COG.ITEM", "COG.FEATURE"];

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const required = { required: true, nullable: false };
    const requiredInteger = { ...required, integer: true };
    const schema = super.defineSchema();

    // Rank
    schema.rank = new fields.NumberField({
      ...requiredInteger,
      initial: COG.FEATURE_RANKS.RANK1,
      choices: COG.FEATURE_RANKS.choices,
      min: COG.FEATURE_RANKS.RANK1,
      max: COG.FEATURE_RANKS.RANK5,
    });

    // Remove unused fields
    delete schema.description.fields.secret;

    return schema;
  }
}
