import { HandlebarsApplicationMixin } from "../../api/_module.mjs";

const { api } = foundry.applications;

/**
 * A base ConfigSheet built on top of ApplicationV2 and the Handlebars rendering backend.
 */
export default class BaseConfigSheet extends HandlebarsApplicationMixin(api.DocumentSheetV2) {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["config"],
    sheetConfig: false,
    config: {
      type: undefined, // Defined by subclass
      includesHeader: false,
    },
  };

  /** @override */
  static PARTS = {
    body: {
      id: "body",
      template: "systems/cog/templates/sheets/actor/config/body.hbs",
    },
    config: {
      id: "config",
      template: undefined, // Defined during _initializeConfigSheetClass,
      scrollable: [""],
    },
  };

  /* -------------------------------------------- */

  /**
   * A method which can be called by subclasses in a static initialization block to refine
   * configuration options at the class level.
   */
  static _initializeConfigSheetClass() {
    const config = this.DEFAULT_OPTIONS.config;
    this.PARTS = foundry.utils.deepClone(this.PARTS);

    // Config Type Configuration
    this.PARTS.config.template = `systems/cog/templates/sheets/actor/config/${config.type}-config.hbs`;
    this.DEFAULT_OPTIONS.classes = [config.type];
  }

  /* -------------------------------------------- */
  /*  Sheet Context                               */
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(_options) {
    return {
      // Data
      header: this.options.config.includesHeader,
    };
  }

  /* -------------------------------------------- */
  /*  Sheet Rendering                             */
  /* -------------------------------------------- */

  /** @override */
  _onRender(_context, _options) {
    this.element
      .querySelector(".scrollable")
      ?.addEventListener("scroll", this.#onScrollContent.bind(this));
  }

  /* -------------------------------------------- */
  /*  Others Event Handlers                       */
  /* -------------------------------------------- */

  /**
   * Add a class depedending on the container being scrolled.
   * @param {PointerEvent} event  The triggering event.
   */
  #onScrollContent(event) {
    const target = event.target;

    target.classList.toggle("scrolling", target.scrollTop > 0);
  }
}
