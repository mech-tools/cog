/**
 * Mixin method for System Documents.
 * @param {typeof Document} Base  Document class being extended.
 * @returns {class}
 */
export default (Base) =>
  class extends Base {

    /** @inheritdoc */
    constructor(...args) {
      super(...args);

      if (!this.constructor.SYSTEM_PATH) {
        throw new Error("SYSTEM_PATH is not defined");
      }
    }

    /* ---------------------------------------- */

    /**
     * Mapping to the System Data object.
     * @type {string}
     * @override
     */
    static SYSTEM_PATH = "";

    /* -------------------------------------------- */
    /*  Merging of Document with System Data        */
    /* -------------------------------------------- */

    /**
     * Merge and return the Document value or object with the System.
     * Will return a merged object if path leads to a Document object or an object with the Document
     * value and the system metadata if path leads to a value.
     * @param {string}  path                  Path to the system Document.
     * @param {Object}  [options]             Additional options which configure the merge.
     * @param {boolean} [options.withField]   If the Document field should add the options field.
     * @param {boolean} [options.withSource]  If the Document values should add the options source.
     * @returns {Object}
     */
    withSystemData(path, { withField = false, withSource = false } = {}) {
      const options = { path, withField, withSource };

      const source = foundry.utils.getProperty(this.system, path);

      if (foundry.utils.getType(source) === "undefined") {
        throw new Error(`Invalid Document path: ${path}`);
      }

      const target = this.getSystemData(path);

      if (foundry.utils.getType(source) === "Object") {
        return this.#mergeWithSystemData(source, target, options);
      } else {
        const key = path.substring(path.lastIndexOf(".") + 1);
        return this.#createDocumentData(key, source, target, options);
      }
    }

    /* ---------------------------------------- */

    /**
     * Get the System object corresponding to a specific path.
     * @param {path} path  Path to the System Data.
     * @returns {Object}
     */
    getSystemData(path) {
      const target = foundry.utils.getProperty(SYSTEM, `${this.constructor.SYSTEM_PATH}.${path}`);

      if (foundry.utils.getType(target) === "undefined") {
        throw new Error(`Invalid System path: ${path}`);
      }

      return target;
    }

    /* ---------------------------------------- */

    /**
     * Merge a Document object with a System object, returning a deep copy of each object.
     * Target keys that are objects and are not in Source keys will be ignored.
     * @param {Object} source     Document object to be merge.
     * @param {Object} target     System Object to be merge.
     * @param {Object} [options]  Additional options which configure the merge.
     * @returns {Object}
     */
    #mergeWithSystemData(source, target, options) {
      const result = {};
      const keys = new Set([...Object.keys(source), ...Object.keys(target)]);

      for (const key of keys) {
        const sourceV = source[key];
        const targetV = target[key];
        const sourceT = foundry.utils.getType(sourceV);
        const targetT = foundry.utils.getType(targetV);

        if (sourceT === "Object" && targetT === "Object") {
          const path = `${options.path}.${key}`;
          result[key] = this.#mergeWithSystemData(sourceV, targetV, { ...options, path });
        } else if (sourceT !== "undefined" && targetT === "undefined") {
          result[key] = foundry.utils.deepClone(sourceV);
        } else if (sourceT === "undefined" && targetT !== "Object") {
          result[key] = foundry.utils.deepClone(targetV);
        } else if (sourceT !== "undefined" && sourceT !== "Object" && targetT === "Object") {
          const path = `${options.path}.${key}`;
          result[key] = this.#createDocumentData(key, sourceV, targetV, { ...options, path });
        }
      }

      return result;
    }

    /* ---------------------------------------- */

    /**
     * Create a new object where the provided key leads to Source and keys of Target are transformed
     * to "{key}_{target_key}"
     * @param {string}  key                   The key to be.
     * @param {any}     source                The Source (can be any value)
     * @param {Object}  target                The Target Object.
     * @param {Object}  [options]             Additional options which configure the merge.
     * @param {string}  [options.path]        Path to the document property.
     * @param {boolean} [options.withField]   If the Document values should add the options field.
     * @param {boolean} [options.withSource]  If the Document values should add the options source.
     * @returns {Object}
     */
    #createDocumentData(key, source, target, { path, withField = false, withSource = false } = {}) {
      return {
        value: foundry.utils.deepClone(source),
        ...(withField && { field: this.system.schema.getField(path) }),
        ...(withSource && { source: foundry.utils.getProperty(this._source.system, path) }),
        ...foundry.utils.deepClone(target),
      };
    }
  };
