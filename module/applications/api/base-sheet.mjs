import systemApplication from "./system-application.mjs";
import HandlebarsApplicationMixin from "./handlebars-application.mjs";

/**
 * Mixin method for COG Sheets applications.
 * @param {typeof ApplicationV2} Base  Application class being extended.
 * @returns {class}
 */
export default (Base) =>
  class extends systemApplication(HandlebarsApplicationMixin(Base)) {

    /** @override */
    static DEFAULT_OPTIONS = {
      classes: ["cog", "standard-form"],
      form: {
        submitOnChange: true,
      },
    };
  };
