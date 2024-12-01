import COGBaseItemSheet from "./base-item-sheet.mjs";

/**
 * A COGBaseItemSheet subclass used to configure Items of the "path" type.
 */
export default class PathSheet extends COGBaseItemSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {},
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
      tags: this.document.system.tags,

      // Data
      type: this.makeField("type"),
    };
  }
}
