/**
 * An object structure used for an enum with keys, values, and labels.
 * @template {any} ValueType
 */
export default class Enum {

  constructor(values) {
    Object.defineProperty(this, "labels", { value: {}, enumerable: false });
    Object.defineProperty(this, "choices", { value: {}, enumerable: false });

    for (const [key, { value, label }] of Object.entries(values)) {
      Object.defineProperty(this, key, { value: value, writable: false, enumerable: true });

      Object.defineProperty(this.labels, key, {
        get: () => this.#labels[key],
        set: (newLabel) => {
          this.#labels[key] = newLabel;
          this.choices[value] = newLabel;
        },
        enumerable: true,
      });

      this.labels[key] = label;
      this.#values[value] = key;
    }

    Object.freeze(this);
    Object.freeze(this.#values);
  }

  /**
   * An internal registry of enum values.
   * @type {Record<string, ValueType>}
   */
  #values = {};

  /**
   * An internal registry of value labels.
   * @type {Record<string, string>}
   */
  #labels = {};

  /**
   * Getter / Setter object for the interal reference to labels.
   * @type {Record<string, string>}
   */
  labels;

  /**
   * The enum expressed as an object of choices suitable for a <select> input or similar use case.
   * @type {Record<ValueType, string>}
   */
  choices;

  /**
   * Provide the label for an enum entry by its key or by its value.
   * @param {string | ValueType} keyOrValue  The value passed to the enum.
   * @returns {string}
   */
  label(keyOrValue) {
    const key = keyOrValue in this.labels ? keyOrValue : this.#values[keyOrValue];
    return this.labels[key];
  }
}
