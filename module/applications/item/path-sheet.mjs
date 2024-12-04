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
   * Prepare and format the display of Features on the item sheet.
   * @returns {{ count: number; values: { any: { item: Object | null } } }}
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

    // Count all available features and deduce completed
    features.count = Object.values(features.values).reduce(
      (count, feature) => (feature.itemData ? count + 1 : count),
      0,
    );
    features.complete = features.count === 5;

    return features;
  }

  /* -------------------------------------------- */
  /*  Sheet Rendering
  /* -------------------------------------------- */

  /** @inheritDoc */
  _onRender(context, options) {
    super._onRender(context, options);

    this.element
      .querySelector('section[data-tab="config"]')
      ?.addEventListener("drop", this.#onDropFeature.bind(this));
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

  /**
   * Handles the dropping of a feature item onto the path item.
   * @param {DragEvent} event  The triggering event.
   */
  async #onDropFeature(event) {
    const data = TextEditor.getDragEventData(event);

    const slot = this.document.system.firstAvailableSlot;
    if (slot) this.document.update({ [`system.features.${slot}`]: data.uuid });
  }
}
