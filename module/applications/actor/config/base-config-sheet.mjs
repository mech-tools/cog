import COGBaseSheet from "../../api/base-sheet.mjs";

const { api } = foundry.applications;

/**
 * A base ConfigSheet built on top of ApplicationV2 and the Handlebars rendering backend.
 */
export default class BaseConfigSheet extends COGBaseSheet(api.DocumentSheetV2) {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["config"],
    position: {
      width: 375,
      height: "auto",
    },
    sheetConfig: false,
    config: {
      type: undefined, // Defined by subclass
    },
  };

  /* -------------------------------------------- */

  /**
   * A method which can be called by subclasses in a static initialization block to refine
   * configuration options at the class level.
   */
  static _initializeConfigSheetClass() {
    const config = this.DEFAULT_OPTIONS.config;

    // Config Type Configuration
    this.DEFAULT_OPTIONS.classes = [config.type];
  }

  /* -------------------------------------------- */
  /*  Sheet Rendering
  /* -------------------------------------------- */

  /** @override */
  _onRender(_context, _options) {
    this.element
      .querySelector(".scrollable")
      ?.addEventListener("scroll", this.#onScrollContent.bind(this));
  }

  /* -------------------------------------------- */
  /*  Others Event Handlers
  /* -------------------------------------------- */

  /**
   * Add a class depedending on the container being scrolled.
   * @param {Event} event  The triggering event.
   */
  #onScrollContent(event) {
    const target = event.target;

    target.classList.toggle("scrolling", target.scrollTop > 0);
  }
}
