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
    const tags = {
      type: COG.PATH_TYPES.choices[this.type],
    };

    switch (this.type) {
      case COG.PATH_TYPES.CULTURAL:
        tags.lifestyle = COG.ACTOR_LIFESTYLES.choices[this.lifestyle];
        break;
    }

    return tags;
  }

  /* -------------------------------------------- */
  /*  Helpers
  /* -------------------------------------------- */

  /**
   * Check if all 5 features exists and the items exists as well.
   * @returns {Promise<boolean>}
   */
  async isValid() {
    const results = await Promise.all(
      Object.entries(this.features).map(async ([rank, featureUuid]) => {
        if (featureUuid === null) return false;

        return await this.isValidFeature(rank);
      }),
    );

    return results.every(Boolean);
  }

  /* -------------------------------------------- */

  /**
   * Given a rank, returns if the feature slot holds a valid "feature" item.
   * @param {string} rank  The rank.
   * @returns {Promise<boolean>}
   */
  async isValidFeature(rank) {
    const item = await fromUuid(this.features[rank]);
    if (!item) return false;

    return item.system.rank === parseInt(rank);
  }

  /* -------------------------------------------- */

  /**
   * Count the number of existing features returning an actual "feature" item.
   * @returns {Promise<number>}
   */
  async featuresCount() {
    const results = await Promise.all(
      Object.entries(this.features).map(async ([rank, featureUuid]) => {
        if (featureUuid === null) return false;

        return await this.isValidFeature(rank);
      }),
    );

    return results.filter(Boolean).length;
  }

  /* -------------------------------------------- */
  /*  Database Workflows
  /* -------------------------------------------- */

  /** @override */
  async _preUpdate(changes, _options, _user) {
    await this.#updateFeatures(changes);
  }

  /* -------------------------------------------- */

  /**
   * Handle the changing of a feature item.
   * @param {Object} changes  Changes on the model.
   * @returns {Promise<void>}
   */
  async #updateFeatures(changes) {
    if (!changes.system?.features) return;

    for (const rank in changes.system.features) {
      const featureUuid = changes.system.features[rank];
      if (featureUuid === null) continue;

      // Check if feature already exists
      if (Object.values(this.features).find((uuid) => uuid === featureUuid)) {
        ui.notifications.warn("COG.PATH.ERRORS.DUPLICATED_FEATURE", { localize: true });
        changes.system.features[rank] = this.features[rank];
        continue;
      }

      const item = await fromUuid(featureUuid);

      // Check if item is of type "pc feature"
      if (item.type !== "pcfeature") {
        ui.notifications.error("COG.PATH.ERRORS.NOT_A_PC_FEATURE", { localize: true });
        changes.system.features[rank] = this.features[rank];
        continue;
      }

      // Check if feature is of right rank
      if (item.system.rank !== parseInt(rank)) {
        ui.notifications.warn(game.i18n.format("COG.PATH.ERRORS.WRONG_FEATURE_RANK", { rank }));
        changes.system.features[rank] = this.features[rank];
        continue;
      }
    }
  }

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const required = { required: true, nullable: false };
    const requiredInteger = { ...required, integer: true };
    const schema = super.defineSchema();

    // Type
    schema.type = new fields.StringField({
      ...required,
      initial: COG.PATH_TYPES.SPECIES,
      choices: COG.PATH_TYPES.choices,
    });

    // Cultural path
    schema[COG.PATH_TYPES.CULTURAL] = new fields.SchemaField({
      // Lifestyle
      lifestyle: new fields.NumberField({
        ...requiredInteger,
        initial: COG.ACTOR_LIFESTYLES.WRETCHED,
        choices: COG.ACTOR_LIFESTYLES.choices,
        label: "COG.PC.FIELDS.lifestyle.level.label",
      }),
    });

    // Features
    schema.features = new fields.SchemaField(
      Array.fromRange(5, 1).reduce((obj, id) => {
        obj[id] = new fields.DocumentUUIDField({ type: "Item" });
        return obj;
      }, {}),
    );

    // Remove unused fields
    delete schema.description.fields.secret;

    return schema;
  }
}
