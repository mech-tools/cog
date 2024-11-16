/**
 * Mixin method for System-based applications.
 * @param {typeof ApplicationV2} Base  Application class being extended.
 * @returns {class}
 */
export default (Base) =>
  class extends Base {

    /* -------------------------------------------- */
    /*  Get and format Document fields              */
    /* -------------------------------------------- */

    /**
     * Merge multiple Document fields with their corresponding System Data.
     * @param {string[]} paths             List of paths leading to Document properties.
     * @param {Object}   [options]         Additional options which configure the building of
     *                                     fields.
     * @param {string}   [options.prefix]  Prefix all paths with the same value.
     * @returns {Object}
     */
    getFields(paths = [], { prefix = "" } = {}) {
      const fields = {};

      for (let path of paths) {
        path = prefix ? `${prefix}.${path}` : path;
        fields[path.substring(path.lastIndexOf(".") + 1)] = this.getField(path);
      }

      return fields;
    }

    /**
     * Merge a Document field with its corresponding System Data.
     * @param {string} path  Path to the Document property.
     * @returns {Object}
     */
    getField(path) {
      return this.document.withSystemData(path, { withField: true, withSource: true });
    }
  };
