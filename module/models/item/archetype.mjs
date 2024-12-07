import COGItemType from "./item-type.mjs";

/**
 * Data schema, attributes, and methods specific to Archetype type Items.
 */
export default class COGArchetype extends COGItemType {

  /** @override */
  static LOCALIZATION_PREFIXES = ["COG.ITEM", "COG.ARCHETYPE"];

  /* -------------------------------------------- */
  /*  Properties
  /* -------------------------------------------- */

  /**
   * Return an object of string formatted tag data which describes this item.
   * @returns {Record<string, string>}
   */
  get tags() {
    const tags = {};

    return tags;
  }

  /* -------------------------------------------- */

  /**
   * Get the first available path slot index.
   * @param {string} type  The type of path to seach for.
   * @returns {string}
   */
  firstAvailableSlot(type) {
    return Object.keys(this.paths).find((path) => path.startsWith(type));
  }

  /* -------------------------------------------- */

  /**
   * Check if all 4 paths exists ("hobby" is optionnal) and the items exists and are valid as well.
   * @returns {Promise<boolean>}
   */
  get isComplete() {
    return Promise.all(
      Object.entries(this.paths).map(async ([key, { value }]) => {
        if (key !== "hobby" && value === null) return false;
        if (key === "hobby" && value === null) return true;

        const path = await fromUuid(value);
        if (!path) return false;

        return await path.system.isComplete;
      }),
    ).then((result) => result.every(Boolean));
  }

  /* -------------------------------------------- */

  /**
   * Count the number of existing path returning an actual "path" item that is also valid.
   * @returns {Promise<number>}
   */
  get pathsCount() {
    return Promise.all(
      Object.values(this.paths).map(async ({ value }) => {
        if (value === null) return false;

        const path = await fromUuid(value);
        if (!path) return false;

        return await path.system.isComplete;
      }),
    ).then((result) => result.filter(Boolean).length);
  }

  /* -------------------------------------------- */
  /*  Database Workflows
  /* -------------------------------------------- */

  /** @override */
  async _preUpdate(changes, _options, _user) {
    if (!changes.system?.paths) return;

    for (const path in changes.system.paths) {
      const pathUuid = changes.system.paths[path]?.value;
      if (!pathUuid || pathUuid === null) continue;

      // Check if the same path does not already exists
      if (
        pathUuid === this.paths.cultural.value ||
        pathUuid === this.paths.hobby.value ||
        pathUuid === this.paths.expertise1.value ||
        pathUuid === this.paths.expertise2.value
      ) {
        ui.notifications.warn("COG.ARCHETYPE.ERRORS.DUPLICATED_PATH", { localize: true });
        changes.system.paths[path].value = null;
        continue;
      }

      const item = await fromUuid(pathUuid);

      // Check if item is of type "path"
      if (item.type !== "path") {
        ui.notifications.error("COG.ARCHETYPE.ERRORS.NOT_A_PATH", { localize: true });
        changes.system.paths[path].value = null;
        continue;
      }

      // Check if path is of right type
      if (
        (path === "hobby" && item.system.type !== COG.PATH_TYPES.EXPERTISE) ||
        (path !== "hobby" && !path.startsWith(item.system.type))
      ) {
        ui.notifications.warn("COG.ARCHETYPE.ERRORS.WRONG_PATH_TYPE", { localize: true });
        changes.system.paths[path].value = null;
        continue;
      }

      // Check that a path is complete
      if (!(await item.system.isComplete)) {
        ui.notifications.error("COG.ARCHETYPE.ERRORS.PATH_INCOMPLETE", { localize: true });
        changes.system.paths[path].value = null;
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

    // Mode
    schema.mode = new fields.StringField({
      ...required,
      initial: COG.ARCHETYPE_MODES.SIMPLE,
      choices: COG.ARCHETYPE_MODES.choices,
    });

    // Hit Die
    schema.hitDie = new fields.SchemaField({
      type: new fields.StringField({
        ...required,
        initial: COG.HIT_DIE_TYPES.D6,
        choices: COG.HIT_DIE_TYPES.choices,
      }),
    });

    // Attacks
    const attacks = ["melee", "range", "psy"];

    schema.attacks = new fields.SchemaField(
      attacks.reduce((obj, id) => {
        obj[id] = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 4 });
        return obj;
      }, {}),
    );

    // Defenses
    const defenses = ["physical", "psy"];

    schema.defenses = new fields.SchemaField(
      defenses.reduce((obj, id) => {
        obj[id] = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 1 });
        return obj;
      }, {}),
    );

    // attributes
    schema.resources = new fields.SchemaField({
      luck: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 2 }),
    });

    // Paths
    const paths = ["cultural", "hobby", "expertise1", "expertise2"];

    schema.paths = new fields.SchemaField(
      paths.reduce((obj, id) => {
        obj[id] = new fields.SchemaField({
          value: new fields.DocumentUUIDField({
            type: "Item",
            label:
              id.startsWith("expertise") && "COG.ARCHETYPE.FIELDS.paths.[expertise].value.label",
          }),
          ...(id !== "hobby" && {
            rank: new fields.NumberField({
              ...requiredInteger,
              initial: 0,
              min: 0,
              max: 2,
              label: "COG.ARCHETYPE.FIELDS.paths.[path].rank.label",
            }),
          }),
        });
        return obj;
      }, {}),
    );

    // Attributes
    schema.attributes = new fields.SchemaField({
      initiative: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 8 }),
      trait: new fields.DocumentUUIDField({ type: "Item" }),
    });

    // Lifestyle
    schema.lifestyle = new fields.SchemaField({
      value: new fields.StringField({
        ...required,
        initial: COG.ACTOR_LIFESTYLES.WRETCHED,
        choices: COG.ACTOR_LIFESTYLES.choices,
      }),
      credits: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        max: 8000,
        step: 1000,
      }),
    });

    // Equipment
    schema.equipment = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 1 });

    // Biography
    schema.biography = new fields.SchemaField({
      relations: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 4 }),
    });

    // Remove unused fields
    delete schema.description.fields.secret;

    return schema;
  }
}
