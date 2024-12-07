import COGBaseItemSheet from "./base-item-sheet.mjs";

/**
 * A COGBaseItemSheet subclass used to configure Items of the "path" type.
 */
export default class PathSheet extends COGBaseItemSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {
      removeFeature: PathSheet.#onRemoveFeature,
    },
    item: {
      type: "path",
    },
  };

  static {
    this._initializeItemSheetClass();

    // Paths tabs
    this.TABS = foundry.utils.deepClone(this.TABS);
    this.TABS.path = [
      { id: "config", group: "paths", label: "COG.PATH.TABS.Config" },
      { id: "features", group: "paths", label: "COG.PATH.TABS.Features" },
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
    context.tags = this.document.system.tags;
    context.type = this.makeField("type");
    context.features = await this.#prepareFeatures();

    // Switch between all types of paths
    switch (context.type.value) {
      case COG.PATH_TYPES.SPECIES:
        context[COG.PATH_TYPES.SPECIES] = {
          communicationMode: this.makeField("species.communicationMode"),
          technologyLevel: this.makeField("species.technologyLevel"),
          culture: this.makeField("species.culture"),
          politicalSystem: this.makeField("species.politicalSystem"),
          gravity: this.makeField("species.gravity"),
        };
        break;

      case COG.PATH_TYPES.CULTURAL:
        context[COG.PATH_TYPES.CULTURAL] = {
          lifestyle: this.makeField("cultural.lifestyle"),
          equipement: this.makeField("cultural.equipement"),
        };
        break;

      case COG.PATH_TYPES.EXPERTISE:
        context[COG.PATH_TYPES.EXPERTISE] = {
          equipement: this.makeField("expertise.equipement"),
        };
        break;
    }

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
    const featuresCount = await this.document.system.featuresCount;

    return foundry.utils.mergeObject(
      tabGroups,
      {
        "sheet.config.isIncomplete": isIncomplete,
        "path.features.isIncomplete": isIncomplete,
        "path.features.count": featuresCount,
      },
      { inplace: true },
    );
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Features on the item sheet.
   * @returns {Promise<{
   *   count: number;
   *   values: { any: { itemData: { uuid: string; name: string; img: string } | null } };
   * }>}
   */
  async #prepareFeatures() {
    const features = {
      values: {},
    };

    for (const rank in this.document.system.features) {
      features.values[rank] = this.makeField(`features.${rank}`);

      // Add Item Data if available
      if (features.values[rank].value !== null) {
        const itemData = await fromUuid(features.values[rank].value);
        if (itemData) {
          features.values[rank].itemData = {
            uuid: itemData.uuid,
            name: itemData.name,
            img: itemData.img,
          };
        }
      }
    }

    return features;
  }

  /* -------------------------------------------- */
  /*  Actions Event Handlers
  /* -------------------------------------------- */

  /**
   * Handle removing a feature from the path.
   * @param {PointerEvent} event   The triggering event.
   * @param {HTMLElement}  target  The targeted dom element.
   */
  static #onRemoveFeature(event, target) {
    const slot = target.dataset.key;

    this.document.update({ [`system.features.${slot}`]: null });
  }

  /* -------------------------------------------- */
  /*  Others Event Handlers
  /* -------------------------------------------- */

  /** @inheritdoc */
  _onDropItem(event) {
    this.#onDropFeature(event);
  }

  /* -------------------------------------------- */

  /**
   * Handles the dropping of a feature item onto the path item.
   * @param {DragEvent} event  The triggering event.
   */
  #onDropFeature(event) {
    const data = TextEditor.getDragEventData(event);

    const slot = this.document.system.firstAvailableSlot;
    if (slot) this.document.update({ [`system.features.${slot}`]: data.uuid });
  }
}
