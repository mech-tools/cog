import COGBaseItemSheet from "./base-item-sheet.mjs";

/**
 * A COGBaseItemSheet subclass used to configure Items of the "feature" type.
 */
export default class FeatureSheet extends COGBaseItemSheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {},
    item: {
      type: "feature",
      advancedDescription: true,
    },
  };

  static {
    this._initializeItemSheetClass();
  }
}
