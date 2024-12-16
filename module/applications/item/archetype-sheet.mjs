import COGBaseItemSheet from "./base-item-sheet.mjs";

/**
 * A COGBaseItemSheet subclass used to configure Items of the "archetype" type.
 */
export default class ArchetypeSheet extends COGBaseItemSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {
      removeTalent: ArchetypeSheet.#onRemoveTalent,
      removePath: ArchetypeSheet.#onRemovePath,
    },
    item: {
      type: "archetype",
    },
  };

  static {
    this._initializeItemSheetClass();
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    Object.assign(context, {
      // Sheet
      tabGroups: await this.#prepareTabGroups(context.tabGroups),

      // Data
      mode: this.makeField("mode"),
      paths: await this.#preparePaths(),
    });

    switch (context.mode.value) {
      // Simple mode
      case COG.ARCHETYPE_MODES.SIMPLE:
        context[COG.ARCHETYPE_MODES.SIMPLE] = {
          hitDie: this.makeField("simple.hitDie"),
          luck: this.makeField("simple.luck"),
          attacks: {
            melee: this.makeField("simple.attacks.melee"),
            range: this.makeField("simple.attacks.range"),
            psy: this.makeField("simple.attacks.psy"),
          },
          initiative: this.makeField("simple.initiative"),
        };
        break;
      // Advanced mode
      case COG.ARCHETYPE_MODES.ADVANCED:
        context[COG.ARCHETYPE_MODES.ADVANCED] = {
          creationPoints: await this.document.system.creationPointsLeft(),
          hitDie: this.makeField("advanced.hitDie"),
          luck: this.makeField("advanced.luck"),
          attacks: {
            melee: this.makeField("advanced.attacks.melee"),
            range: this.makeField("advanced.attacks.range"),
            psy: this.makeField("advanced.attacks.psy"),
          },
          initiative: this.makeField("advanced.initiative"),
          talent: await this.#prepareTalent(),
          defenses: {
            melee: this.makeField("advanced.defenses.physical"),
            range: this.makeField("advanced.defenses.psy"),
          },
          lifestyle: {
            level: this.#prepareLifestyleLevel(),
            credits: this.makeField("advanced.lifestyle.credits"),
          },
          equipment: this.makeField("advanced.equipment"),
          relations: this.makeField("advanced.relations"),
        };
        break;
    }

    console.error(context);

    return context;
  }

  /* -------------------------------------------- */

  /**
   * Update and return a new tabGroups object updated with metadata.
   * @param {Object} tabGroups  The tabGroups being updated.
   * @returns {Promise<{ any: { any: { incomplete: boolean } } }>}
   */
  async #prepareTabGroups(tabGroups) {
    const isInvalid = !(await this.document.system.isValid());

    return foundry.utils.mergeObject(
      tabGroups,
      { "sheet.config.isInvalid": isInvalid },
      { inplace: true },
    );
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of the Lifestyle Level on the item sheet.
   * @returns {{
   *   options: { value: number; label: string; disabled: boolean };
   * }}
   */
  #prepareLifestyleLevel() {
    const level = this.makeField("advanced.lifestyle.level");
    level.options = [];

    for (const [lvl, label] of Object.entries(COG.ACTOR_LIFESTYLES.choices)) {
      level.options.push({ value: lvl, label, disabled: lvl > COG.ACTOR_LIFESTYLES.COMFORTABLE });
    }

    return level;
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Paths on the item sheet.
   * @returns {{
   *   any: { itemData: { uuid: string; name: string; img: string; error: boolean } | null };
   * }}
   */
  async #preparePaths() {
    const paths = {};

    for (const path in this.document.system.paths) {
      paths[path] = {
        value: this.makeField(`paths.${path}.value`),
        ...("rank" in this.document.system.paths[path] && {
          rank: this.makeField(`paths.${path}.rank`),
        }),
      };

      // Add Item Data if available
      if (paths[path].value.value !== null) {
        const itemData = await fromUuid(paths[path].value.value);
        if (itemData) {
          paths[path].value.itemData = {
            uuid: itemData.uuid,
            name: itemData.name,
            img: itemData.img,
            error:
              !(await this.document.system.isValidPath(path)) || !(await itemData.system.isValid()),
          };
        }
      }
    }

    return paths;
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of the Talent on the item sheet.
   * @returns {{
   *   any: { itemData: { uuid: string; name: string; img: string } | null };
   * }}
   */
  async #prepareTalent() {
    const talent = this.makeField("advanced.talent");

    // Add Item Data if available
    if (talent.value !== null) {
      const itemData = await fromUuid(talent.value);
      if (itemData) {
        talent.itemData = {
          uuid: itemData.uuid,
          name: itemData.name,
          img: itemData.img,
        };
      }
    }

    return talent;
  }

  /* -------------------------------------------- */
  /*  Actions Event Handlers
  /* -------------------------------------------- */

  /**
   * Handle removing the Talent from the archetype.
   * @param {PointerEvent} event   The triggering event.
   * @param {HTMLElement}  target  The targeted dom element.
   */
  static #onRemoveTalent(event, target) {
    this.document.update({ ["system.advanced.talent"]: null });
  }

  /* -------------------------------------------- */

  /**
   * Handle removing a Path from the archetype.
   * @param {PointerEvent} event   The triggering event.
   * @param {HTMLElement}  target  The targeted dom element.
   */
  static #onRemovePath(event, target) {
    const slot = target.dataset.key;

    this.document.update({ [`system.paths.${slot}.value`]: null });
  }

  /* -------------------------------------------- */
  /*  Others Event Handlers
  /* -------------------------------------------- */

  /** @inheritdoc */
  _onDropItem(event) {
    const target = event.currentTarget;

    target.dataset.key === "talent" ? this.#onDropTalent(event) : this.#onDropPath(event);
  }

  /* -------------------------------------------- */

  /**
   * Handles the dropping of a path item onto the archetype item.
   * @param {DragEvent} event  The triggering event.
   */
  #onDropTalent(event) {
    const data = TextEditor.getDragEventData(event);

    this.document.update({ [`system.advanced.talent`]: data.uuid });
  }
  /* -------------------------------------------- */

  /**
   * Handles the dropping of a path item onto the archetype item.
   * @param {DragEvent} event  The triggering event.
   */
  #onDropPath(event) {
    const data = TextEditor.getDragEventData(event);
    const pathType = event.currentTarget.dataset.key;

    this.document.update({ [`system.paths.${pathType}.value`]: data.uuid });
  }
}
