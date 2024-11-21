import HandlebarsApplicationMixin from "./handlebars-application.mjs";

/**
 * Mixin method for COG Sheets applications.
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

    /**
     * Create an object including field, source and value for a document property.
     * Will only return field if the document property field is of type SchemaField.
     * @param {string} path  Path to the Document field.
     * @returns {{ field: foundry.data.fields.DataField; source?: any; value?: any }}
     */
    makeField(path) {
      const field = this.document.system.schema.getField(path);

      if (!field) {
        throw new Error(`Invalid Document path: ${path}`);
      }

      return {
        field,
        ...(!(field instanceof foundry.data.fields.SchemaField) && {
          value: foundry.utils.getProperty(this.document.system, path),
          source: foundry.utils.getProperty(this.document._source.system, path),
        }),
      };
    }
  };
