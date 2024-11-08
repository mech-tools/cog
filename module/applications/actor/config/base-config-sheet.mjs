const { api } = foundry.applications;

/**
 * A base ConfigSheet built on top of ApplicationV2 and the Handlebars rendering backend.
 */
export default class BaseConfigSheet extends api.HandlebarsApplicationMixin(api.DocumentSheetV2) {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["cog", "config", "standard-form"],
    sheetConfig: false,
    form: {
      submitOnChange: true,
    },
    config: {
      type: undefined, // Defined by subclass
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

  /** @inheritdoc */
  // _replaceHTML(result, content, options) {
  //   console.error(content);
  //   const scrollPositions = [];

  //   // Store previous scroll positions
  //   for (const [partId, newElement] of Object.entries(result)) {
  //     for (const selector of this.constructor.PARTS[partId].scrollable || []) {
  //       const priorPart = content.querySelector(`[data-application-part="${partId}"]`);
  //       const priorElement = selector === "" ? priorPart : priorPart?.querySelector(selector);

  //       if (priorElement) {
  //         scrollPositions.push([newElement, priorElement.scrollTop, priorElement.scrollLeft]);
  //       }
  //     }
  //   }

  //   // Replace HTML with the new content
  //   super._replaceHTML(result, content, options);

  //   // Restore previous positions
  //   for (const [newElement, scrollTop, scrollLeft] of scrollPositions) {
  //     Object.assign(newElement, { scrollTop, scrollLeft });
  //   }
  // }

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

    target.classList.toggle("scrolling", target.scrollTop > 30);
  }
}
