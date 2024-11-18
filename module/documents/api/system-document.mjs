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

    /**
     * Object key to access the System metadata.
     * @type {string}
     */
    static METADATA_KEY = "_mt";

    /* -------------------------------------------- */
    /*  Merging of Document with System Data        */
    /* -------------------------------------------- */

    /**
     * Merge and return the Document value or object with the System metadata.
     * @param {string}  path                 Path to the system Document.
     * @param {Object}  [options]            Additional options which configure the merge.
     * @param {boolean} [options.withField]  If the Document field should add the options field.
     * @returns {Object}
     */
    withSystemMetadata(path, { withField = false } = {}) {
      const options = { path, withField };

      const document = this.getDocumentData(path);
      const system = this.getSystemData(path);

      if (foundry.utils.getType(document) === "Object") {
        return this.#mergeWithSystemData(document, system, options);
      } else {
        const key = path.substring(path.lastIndexOf(".") + 1);
        const result = { [key]: document };
        return this.#addSystemMetadata(key, result, system, options);
      }
    }

    /* ---------------------------------------- */

    /**
     * Get the Document object corresponding to a specific path.
     * @param {path} path  Path to the Document Data.
     * @returns {Object}
     */
    getDocumentData(path) {
      const target = foundry.utils.getProperty(this.system, path);

      if (foundry.utils.getType(target) === "undefined") {
        throw new Error(`Invalid Document path: ${path}`);
      }

      return foundry.utils.deepClone(target);
    }

    /**
     * Get the System object corresponding to a specific path.
     * @param {path} path  Path to the System Data.
     * @returns {Object}
     */
    getSystemData(path) {
      const target = foundry.utils.getProperty(SYSTEM, `${this.constructor.SYSTEM_PATH}.${path}`);

      return foundry.utils.deepClone(target) || {};
    }

    /* ---------------------------------------- */

    /**
     * Merge an object with a System object.
     * Target keys that are objects and are not in Source keys will be ignored.
     * @param {Object} source     Document object to be merge.
     * @param {Object} system     System Object to be merge.
     * @param {Object} [options]  Additional options which configure the merge.
     * @returns {Object}
     */
    #mergeWithSystemData(source, system, options) {
      const keys = new Set([...Object.keys(source), ...Object.keys(system)]);

      for (const key of keys) {
        const sourceV = source[key];
        const systemV = system[key];
        const sourceT = foundry.utils.getType(sourceV);
        const systemT = foundry.utils.getType(systemV);
        const path = `${options.path}.${key}`;

        if (sourceT === "Object" && systemT === "Object") {
          source[key] = this.#mergeWithSystemData(sourceV, systemV, { ...options, path });
        } else if (
          (sourceT === "undefined" && systemT !== "Object") ||
          (sourceT !== "undefined" && sourceT !== "Object" && systemT === "Object")
        ) {
          this.#addSystemMetadata(key, source, systemV, { ...options, path });
        }
      }

      return source;
    }

    /**
     * Add System metadata to a source object representing a Document path.
     * The key storing the metadata is defined by METADATA_KEY.
     * @param {string}  key                  The key defining the source data.
     * @param {!Object} source               The source data.
     * @param {any}     system               The System metadata.
     * @param {Object}  [options]            Additional options which configure the merge.
     * @param {path}    [options.path]       Path to the Document value represented by the source
     *                                       data.
     * @param {boolean} [options.withField]  If the metadata should include the corresponding
     *                                       Document field.
     * @returns {Object}
     */
    #addSystemMetadata(key, source, system, { path, withField = false } = {}) {
      const mt_key = this.constructor.METADATA_KEY;

      if (!source[mt_key]) source[mt_key] = {};

      if (foundry.utils.getType(system) === "Object") {
        source[mt_key][key] = {
          ...(withField && { field: this.system.schema.getField(path) }),
          ...system,
        };
      } else {
        source[mt_key][key] = system;
      }

      return source;
    }
  };
