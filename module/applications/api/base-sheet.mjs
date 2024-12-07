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
      actions: {
        editImage: this.#onEditImage,
      },
    };

    /* ----------------------------------------- */
    /* Helpers
    /* ----------------------------------------- */

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

    /* ----------------------------------------- */
    /* Sheet context
    /* ----------------------------------------- */

    /**
     * Configure the tabs used by this sheet.
     * @returns {Record<string, Record<string, ApplicationTab>>}
     */
    _getTabs() {
      const tabs = {};

      for (const [groupId, config] of Object.entries(this.constructor.TABS)) {
        const group = {};

        for (const t of config) {
          if (!this.tabGroups[t.group]) this.tabGroups[t.group] = config[0].id;
          const active = this.tabGroups[t.group] === t.id;

          const cssClass = [];
          if (active) cssClass.push("active");
          if (t.padded) cssClass.push("padded");

          group[t.id] = {
            active,
            cssClass: cssClass.join(" "),
            ...t,
          };
        }

        tabs[groupId] = group;
      }

      return tabs;
    }

    /* ----------------------------------------- */
    /* Sheet rendering
    /* ----------------------------------------- */

    /** @inheritdoc */
    _onRender(_context, _options) {
      const textareas = this.element.querySelectorAll("textarea");

      for (const textarea of textareas) {
        textarea.addEventListener("input", this.#resizeTextareaIn.bind(this));
        textarea.addEventListener("focusin", this.#resizeTextareaIn.bind(this));
        textarea.addEventListener("focusout", this.#resizeTextareaOut.bind(this));
      }
    }

    /* -------------------------------------------- */
    /*  Actions Event Handlers
  /* -------------------------------------------- */

    /**
     * Edit the Actor profile image.
     * @param {PointerEvent} event   The triggering event.
     * @param {HTMLElement}  target  The targeted dom element.
     * @returns {Promise<void>}
     */
    static async #onEditImage(event, target) {
      const attr = target.dataset.edit;
      const current = foundry.utils.getProperty(this.document, attr);
      const fp = new FilePicker({
        current,
        type: "image",
        callback: (path) => {
          target.src = path;
          if (this.options.form.submitOnChange) {
            const submit = new Event("submit");
            this.element.dispatchEvent(submit);
          }
        },
        top: this.position.top + 40,
        left: this.position.left + 10,
      });
      await fp.browse();
    }

    /* -------------------------------------------- */
    /*  Others Event Handlers
    /* -------------------------------------------- */

    /**
     * Automatically resize textareas.
     * @param {InputEvent | FocusEvent} event  The triggering event.
     */
    #resizeTextareaIn(event) {
      const target = event.target;
      const maxHeight = 100;
      target.style.height = "auto";

      if (target.scrollHeight > maxHeight) {
        target.style.height = `${maxHeight}px`;
      } else {
        const { borderTopWidth, borderBottomWidth, marginTop, marginBottom } =
          window.getComputedStyle(target);

        target.style.height = `${target.scrollHeight + parseFloat(borderTopWidth) + parseFloat(borderBottomWidth) + parseFloat(marginTop) + parseFloat(marginBottom)}px`;
      }
    }

    /* -------------------------------------------- */

    /**
     * Automatically reset textareas size to default.
     * @param {FocusEvent} event  The triggering event.
     */
    #resizeTextareaOut(event) {
      const target = event.target;

      target.style.height = "auto";
    }
  };
