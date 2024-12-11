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
    const tags = {
      mode: COG.ARCHETYPE_MODES.choices[this.mode],
    };

    return tags;
  }

  /* -------------------------------------------- */
  /*  Helpers
  /* -------------------------------------------- */

  /**
   * Given a path type, returns if the path slot contains a valid "path" item.
   * @param {string} path  The path type.
   * @returns {Promise<boolean>}
   */
  async isValidPath(path) {
    const item = await fromUuid(this.paths[path].value);
    if (!item) return false;

    if (
      (path !== "hobby" && !path.startsWith(item.system.type)) ||
      (path === "hobby" && item.system.type !== COG.PATH_TYPES.EXPERTISE)
    )
      return false;

    return await item.system.isComplete;
  }

  /* -------------------------------------------- */

  /**
   * Check if all 4 paths exists ("hobby" is optionnal) and the "path" items are valid.
   * @returns {Promise<boolean>}
   */
  async isComplete() {
    const results = await Promise.all(
      Object.entries(this.paths).map(async ([path, { value: pathUuid }]) => {
        if (path !== "hobby" && pathUuid === null) return false;
        if (path === "hobby" && pathUuid === null) return true;

        return await this.isValidPath(path);
      }),
    );

    return results.every(Boolean);
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
        changes.system.paths[path].value = this.paths[path].value;
        continue;
      }

      const item = await fromUuid(pathUuid);

      // Check if item is of type "path"
      if (item.type !== "path") {
        ui.notifications.error("COG.ARCHETYPE.ERRORS.NOT_A_PATH", { localize: true });
        changes.system.paths[path].value = this.paths[path].value;
        continue;
      }

      // Check if path is of right type
      if (
        (path === "hobby" && item.system.type !== COG.PATH_TYPES.EXPERTISE) ||
        (path !== "hobby" && !path.startsWith(item.system.type))
      ) {
        ui.notifications.warn("COG.ARCHETYPE.ERRORS.WRONG_PATH_TYPE", { localize: true });
        changes.system.paths[path].value = this.paths[path].value;
        continue;
      }

      // Check that a path is complete
      if (!(await item.system.isComplete)) {
        ui.notifications.error("COG.ARCHETYPE.ERRORS.PATH_INCOMPLETE", { localize: true });
        changes.system.paths[path].value = this.paths[path].value;
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

    // Simple configuration
    schema[COG.ARCHETYPE_MODES.SIMPLE] = new fields.SchemaField({
      // Hit Die
      hitDie: new fields.NumberField({
        ...requiredInteger,
        initial: COG.HIT_DIE_TYPES.D6,
        choices: COG.HIT_DIE_TYPES.choices,
        min: COG.HIT_DIE_TYPES.D6,
        max: COG.HIT_DIE_TYPES.D10,
        label: "COG.PC.FIELDS.hitDie.type.label",
      }),

      // Luck
      luck: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        label: "COG.PC.FIELDS.resources.luck.label",
      }),

      // Attacks
      attacks: new fields.SchemaField(
        ["melee", "range", "psy"].reduce((obj, id) => {
          obj[id] = new fields.NumberField({
            ...requiredInteger,
            initial: 0,
            min: 0,
            label: `COG.ACTOR.FIELDS.attacks.${id}.label`,
            hint: "COG.ARCHETYPE.FIELDS.simple.[attack].hint",
          });
          return obj;
        }, {}),
      ),

      // Initiative
      initiative: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        label: "COG.ACTOR.FIELDS.attributes.initiative.label",
      }),
    });

    // Advanced configuration
    schema[COG.ARCHETYPE_MODES.ADVANCED] = new fields.SchemaField({
      // Hit Die
      hitDie: new fields.NumberField({
        ...requiredInteger,
        initial: COG.HIT_DIE_TYPES.D6,
        choices: COG.HIT_DIE_TYPES.choices,
        min: COG.HIT_DIE_TYPES.D6,
        max: COG.HIT_DIE_TYPES.D10,
        label: "COG.PC.FIELDS.hitDie.type.label",
      }),

      // Luck
      luck: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        max: 2,
        label: "COG.PC.FIELDS.resources.luck.label",
      }),

      // Attacks
      attacks: new fields.SchemaField(
        ["melee", "range", "psy"].reduce((obj, id) => {
          obj[id] = new fields.NumberField({
            ...requiredInteger,
            initial: 0,
            min: 0,
            max: 4,
            label: `COG.ACTOR.FIELDS.attacks.${id}.label`,
            hint: "COG.ARCHETYPE.FIELDS.advanced.[attack].hint",
          });
          return obj;
        }, {}),
      ),

      // Initiative
      initiative: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        max: 8,
        label: "COG.ACTOR.FIELDS.attributes.initiative.label",
      }),

      // Trait
      trait: new fields.DocumentUUIDField({
        type: "Item",
      }),

      // Defenses
      defenses: new fields.SchemaField(
        ["physical", "psy"].reduce((obj, id) => {
          obj[id] = new fields.NumberField({
            ...requiredInteger,
            initial: 0,
            min: 0,
            max: 1,
            hint: "COG.ARCHETYPE.FIELDS.advanced.[defense].hint",
          });
          return obj;
        }, {}),
      ),

      // Lifestyle
      lifestyle: new fields.SchemaField({
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
      }),

      // Equipment
      equipment: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        max: 1,
      }),

      // Relations
      relations: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        max: 4,
      }),
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

    // Remove unused fields
    delete schema.description.fields.secret;

    return schema;
  }
}
