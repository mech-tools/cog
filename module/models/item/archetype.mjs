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
   * Compute the number of creation points left on this archetype.
   * @returns {number}
   */
  async creationPointsLeft() {
    let left =
      COG.ARCHETYPE_CREATION_POINTS -
      this.advanced.lifestyle.credits / 1_000 -
      this.advanced.equipment -
      this.advanced.initiative -
      this.advanced.defenses.physical * 2 -
      this.advanced.defenses.psy * 2 -
      this.advanced.attacks.melee * 2 -
      this.advanced.attacks.range * 2 -
      this.advanced.attacks.psy * 2 -
      (this.advanced.hitDie - COG.HIT_DIE_TYPES.D6) -
      this.advanced.relations / 2 -
      this.advanced.luck;

    const culturalPath = await fromUuid(this.paths.cultural.value);
    if (culturalPath && this.advanced.lifestyle.level > culturalPath.system.cultural.lifestyle)
      left -= 2;

    if (this.advanced.talent !== null) left -= 3;

    for (const path in this.paths) {
      if (this.paths[path].value !== null && this.paths[path].rank)
        left -= this.paths[path].rank * 4;
    }

    return left;
  }

  /* -------------------------------------------- */

  /**
   * Check if all 4 paths exists ("hobby" is optionnal) and the "path" items are valid.
   * @returns {Promise<boolean>}
   */
  async isValid() {
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

    return await item.system.isValid();
  }

  /* -------------------------------------------- */
  /*  Database Workflows
  /* -------------------------------------------- */

  /** @override */
  async _preUpdate(changes, _options, _user) {
    await this.#updateTalent(changes);
    await this.#updatePaths(changes);
  }

  /* -------------------------------------------- */

  /**
   * Handle the changing of the talent item.
   * @param {Object} changes  Changes on the model.
   * @returns {Promise<void>}
   */
  async #updateTalent(changes) {
    if (!changes.system?.advanced?.talent) return;

    const talentUuid = changes.system.advanced.talent;
    if (talentUuid === null) return;

    const item = await fromUuid(talentUuid);

    // Check if item is of type "talent"
    if (item.type !== "talent") {
      ui.notifications.error("COG.ARCHETYPE.ERRORS.NOT_A_TALENT", { localize: true });
      changes.system.advanced.talent = this.advanced.talent;
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle the changing of the paths items.
   * @param {Object} changes  Changes on the model.
   * @returns {Promise<void>}
   */
  async #updatePaths(changes) {
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
      if (!(await item.system.isValid())) {
        ui.notifications.error("COG.ARCHETYPE.ERRORS.PATH_INCOMPLETE", { localize: true });
        changes.system.paths[path].value = this.paths[path].value;
        continue;
      }

      // Update lifestyle based on the new culutural path
      if (path === "cultural") {
        foundry.utils.setProperty(
          changes,
          "system.advanced.lifestyle.level",
          item.system[COG.PATH_TYPES.CULTURAL].lifestyle,
        );
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
            label: `COG.ARCHETYPE.FIELDS.[mode].attacks.${id}.label`,
            hint: "COG.ARCHETYPE.FIELDS.simple.attacks.[attack].hint",
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
      // Equipment
      equipment: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        max: 8,
        step: 1,
      }),

      // Lifestyle
      lifestyle: new fields.SchemaField({
        // Level
        level: new fields.NumberField({
          ...requiredInteger,
          initial: COG.ACTOR_LIFESTYLES.WRETCHED,
          choices: COG.ACTOR_LIFESTYLES.choices,
          label: "COG.PC.FIELDS.lifestyle.level.label",
        }),

        // Credits
        credits: new fields.NumberField({
          ...requiredInteger,
          initial: 0,
          min: 0,
          max: 8000,
          step: 1000,
          label: "COG.PC.FIELDS.lifestyle.credits.label",
        }),
      }),

      // Talent
      talent: new fields.DocumentUUIDField({
        type: "Item",
        label: "COG.PC.FIELDS.advancement.talent.label",
      }),

      // Initiative
      initiative: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        max: 8,
        label: "COG.ACTOR.FIELDS.attributes.initiative.label",
      }),

      // Defenses
      defenses: new fields.SchemaField(
        ["physical", "psy"].reduce((obj, id) => {
          obj[id] = new fields.NumberField({
            ...requiredInteger,
            initial: 0,
            min: 0,
            max: 1,
            hint: "COG.ARCHETYPE.FIELDS.advanced.defenses.[defense].hint",
          });
          return obj;
        }, {}),
      ),

      // Attacks
      attacks: new fields.SchemaField(
        ["melee", "range", "psy"].reduce((obj, id) => {
          obj[id] = new fields.NumberField({
            ...requiredInteger,
            initial: 0,
            min: 0,
            max: 4,
            label: `COG.ARCHETYPE.FIELDS.[mode].attacks.${id}.label`,
            hint: "COG.ARCHETYPE.FIELDS.advanced.attacks.[attack].hint",
          });
          return obj;
        }, {}),
      ),

      // Hit Die
      hitDie: new fields.NumberField({
        ...requiredInteger,
        initial: COG.HIT_DIE_TYPES.D6,
        choices: COG.HIT_DIE_TYPES.choices,
        min: COG.HIT_DIE_TYPES.D6,
        max: COG.HIT_DIE_TYPES.D10,
        label: "COG.PC.FIELDS.hitDie.type.label",
      }),

      // Relations
      relations: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        max: 16,
        step: 2,
        label: "COG.PC.FIELDS.biography.relations.label",
      }),

      // Luck
      luck: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
        min: 0,
        max: 2,
        label: "COG.PC.FIELDS.resources.luck.label",
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
              hint: "COG.ARCHETYPE.FIELDS.paths.[path].rank.hint",
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
