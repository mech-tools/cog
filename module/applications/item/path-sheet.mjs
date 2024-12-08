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
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    return {
      ...context,

      // Sheet
      tabGroups: await this.#prepareTabGroups(context.tabGroups),

      // Data
      type: this.makeField("type"),
      features: await this.#prepareFeatures(),
      ...(this.document.system.type === COG.PATH_TYPES.CULTURAL && {
        lifestyle: this.makeField("lifestyle"),
      }),
    };
  }

  /* -------------------------------------------- */

  /**
   * Update and return a new tabGroups object updated with metadata.
   * @param {Object} tabGroups  The tabGroups being updated.
   * @returns {Promise<{ any: { any: { incomplete: boolean } } }>}
   */
  async #prepareTabGroups(tabGroups) {
    const isIncomplete = !(await this.document.system.isComplete);

    return foundry.utils.mergeObject(
      tabGroups,
      { "sheet.config.isIncomplete": isIncomplete },
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
      isIncomplete: !(await this.document.system.isComplete),
      count: await this.document.system.featuresCount,
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

    const slot = this.document.system.firstAvailableFeatureSlot;
    if (slot) this.document.update({ [`system.features.${slot}`]: data.uuid });
  }
}
