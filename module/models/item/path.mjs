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
        tags.lifestyle = COG.ACTOR_LIFESTYLES.choices[this[COG.PATH_TYPES.CULTURAL].lifestyle];
        break;
    }

    return tags;
  }

  /* -------------------------------------------- */

  /**
   * Get the first available feature slot index.
   * @returns {string}
   */
  get firstAvailableSlot() {
    return Object.entries(this.features).find(([, value]) => value === null)?.[0];
  }

  /* -------------------------------------------- */
  /*  Database Workflows
  /* -------------------------------------------- */

  /** @override */
  async _preUpdate(changes, _options, _user) {
    if (!changes.system?.features) return;

    for (const rank in changes.system.features) {
      const featureUuid = changes.system.features[rank];
      if (featureUuid === null) continue;

      // Check if feature already exists
      if (Object.values(this.features).find((uuid) => uuid === featureUuid)) {
        ui.notifications.warn("COG.PATH.ERRORS.DUPLICATE_FEATURE", { localize: true });
        changes.system.features[rank] = null;
      }

      // Check if item is of type "feature"
      const item = await fromUuid(featureUuid);
      if (item.type !== "feature") {
        ui.notifications.error("COG.PATH.ERRORS.NOT_A_FEATURE", { localize: true });
        changes.system.features[rank] = null;
      }
    }

    // Reset features order
    const mergedFeatures = foundry.utils.mergeObject(this.features, changes.system.features, {
      inplace: true,
    });

    const newFeatures = Object.values(mergedFeatures).filter((value) => value !== null);
    if (!newFeatures.length) return;

    const updates = {};

    for (const key in this.features) {
      updates[`system.features.${key}`] = newFeatures[`${parseInt(key) - 1}`] ?? null;
    }

    Object.assign(changes, updates);
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

    // Species
    schema[COG.PATH_TYPES.SPECIES] = new fields.SchemaField({
      communicationMode: new fields.StringField(),
      technologyLevel: new fields.StringField(),
      culture: new fields.StringField(),
      politicalSystem: new fields.StringField(),
      gravity: new fields.StringField(),
    });

    // Cultural
    schema[COG.PATH_TYPES.CULTURAL] = new fields.SchemaField({
      lifestyle: new fields.StringField({
        ...required,
        initial: COG.ACTOR_LIFESTYLES.WRETCHED,
        choices: COG.ACTOR_LIFESTYLES.choices,
      }),
      equipement: new fields.StringField(),
    });

    // Expertise
    schema[COG.PATH_TYPES.EXPERTISE] = new fields.SchemaField({
      equipement: new fields.StringField(),
    });

    // Features
    schema.features = new fields.SchemaField(
      Array.fromRange(5, 1).reduce((obj, id) => {
        obj[id] = new fields.DocumentUUIDField({
          type: "Item",
          label: "COG.PATH.FIELDS.features.[rank].label",
        });
        return obj;
      }, {}),
    );

    // Remove unused fields
    delete schema.description.fields.secret;

    return schema;
  }
}
