import COGBaseItemSheet from "./base-item-sheet.mjs";

/**
 * A COGBaseItemSheet subclass used to configure Items of the "archetype" type.
 */
export default class ArchetypeSheet extends COGBaseItemSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {
      removePath: ArchetypeSheet.#onRemovePath,
    },
    item: {
      type: "archetype",
    },
  };

  static {
    this._initializeItemSheetClass();

    // Archetype tabs
    this.TABS = foundry.utils.deepClone(this.TABS);
    this.TABS.archetype = [
      { id: "config", group: "archetype", label: "COG.ARCHETYPE.TABS.Config" },
      { id: "paths", group: "archetype", label: "COG.ARCHETYPE.TABS.Paths" },
    ];
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    // Sheet
    context.tabGroups = await this.#prepareTabGroups(context.tabGroups);

    // Data
    context.mode = this.makeField("mode");
    context.paths = await this.#preparePaths();

    return context;
  }

  /* -------------------------------------------- */

  /**
   * Update and return a new tabGroups object updated with metadata.
   * @param {Object} tabGroups  The tabGroups being updated.
   * @returns {Promise<{ any: { any: { incomplete: boolean; count: number } } }>}
   */
  async #prepareTabGroups(tabGroups) {
    const isIncomplete = !(await this.document.system.isComplete);
    const pathsCount = await this.document.system.pathsCount;

    const updatedTabGroups = foundry.utils.mergeObject(
      tabGroups,
      {
        "sheet.config.incomplete": isIncomplete,
        "archetype.paths.incomplete": isIncomplete,
        "archetype.paths.count": pathsCount,
      },
      { inplace: true },
    );

    return updatedTabGroups;
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
            error: !(await itemData.system.isComplete),
          };
        }
      }
    }

    return paths;
  }

  /* -------------------------------------------- */
  /*  Actions Event Handlers
  /* -------------------------------------------- */

  /**
   * Handle removing a feature from the path.
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
  async _onDropItem(event) {
    this.#onDropPath(event);
  }

  /* -------------------------------------------- */

  /**
   * Handles the dropping of a path item onto the archetype item.
   * @param {DragEvent} event  The triggering event.
   */
  async #onDropPath(event) {
    const data = TextEditor.getDragEventData(event);
    const pathType = event.currentTarget.dataset.key;

    this.document.update({ [`system.paths.${pathType}.value`]: data.uuid });
  }
}
