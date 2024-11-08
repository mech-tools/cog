const { HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Mixin method for ApplicationV2-based applications.
 * @param {typeof ApplicationV2} Base  Application class being extended.
 * @returns {class}
 */
export default (Base) =>
  class extends HandlebarsApplicationMixin(Base) {
    /** @override */
    static DEFAULT_OPTIONS = {
      classes: ["cog", "standard-form"],
      form: {
        submitOnChange: true,
      },
    };

    /* -------------------------------------------- */
    /*  Rendering                                   */
    /* -------------------------------------------- */

    /** @inheritdoc */
    _replaceHTML(result, content, options) {
      const scrollPositions = [];

      // Store previous scroll positions
      for (const [partId, newElement] of Object.entries(result)) {
        for (const selector of this.constructor.PARTS[partId].scrollable || []) {
          const priorPart = content.querySelector(`[data-application-part="${partId}"]`);
          const priorElement = selector === "" ? priorPart : priorPart?.querySelector(selector);

          if (priorElement) {
            scrollPositions.push([newElement, priorElement.scrollTop, priorElement.scrollLeft]);
          }
        }
      }

      // Replace HTML with the new content
      super._replaceHTML(result, content, options);

      // Restore previous positions
      for (const [newElement, scrollTop, scrollLeft] of scrollPositions) {
        Object.assign(newElement, { scrollTop, scrollLeft });
      }
    }
  };
