import COGBaseSheet from "../api/base-sheet.mjs";

const { sheets } = foundry.applications;

/**
 * A base ItemSheet built on top of ApplicationV2 and the Handlebars rendering backend.
 */
export default class COGBaseItemSheet extends COGBaseSheet(sheets.ItemSheetV2) {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["item"],
    position: {
      width: 560,
      height: "auto",
    },
    actions: {
      editImage: COGBaseItemSheet.#onEditImage,
    },
    item: {
      type: undefined, // Defined by subclass
      advancedDescription: false,
    },
  };

  /** @override */
  static PARTS = {
    header: {
      id: "header",
      template: "systems/cog/templates/sheets/item/header.hbs",
    },
    tabs: {
      id: "tabs",
      template: "templates/generic/tab-navigation.hbs",
    },
    description: {
      id: "description",
      template: "systems/cog/templates/sheets/item/description.hbs",
    },
    config: {
      id: "config",
      template: undefined, // Defined during _initializeItemSheetClass
    },
  };

  /**
   * Define the structure of tabs used by this Item Sheet.
   * @type {Record<string, Array<Record<string, ApplicationTab>>>}
   */
  static TABS = {
    sheet: [
      {
        id: "description",
        group: "sheet",
        icon: "fa-duotone fa-solid fa-bookmark",
        label: "COG.ITEM.TABS.Description",
      },
      {
        id: "config",
        group: "sheet",
        icon: "fa-duotone fa-regular fa-gears",
        label: "COG.ITEM.TABS.Config",
      },
    ],
  };

  /** @override */
  tabGroups = {
    sheet: "description",
    description: "public", // Used by advancedDescription
  };

  /* -------------------------------------------- */

  /**
   * A method which can be called by subclasses in a static initialization block to refine
   * configuration options at the class level.
   */
  static _initializeItemSheetClass() {
    const item = this.DEFAULT_OPTIONS.item;
    this.PARTS = foundry.utils.deepClone(this.PARTS);
    this.TABS = foundry.utils.deepClone(this.TABS);

    // Item Type Configuration
    this.PARTS.config.template = `systems/cog/templates/sheets/item/${item.type}-config.hbs`;
    this.DEFAULT_OPTIONS.classes = [item.type];

    // Advanced Description
    if (item.advancedDescription) {
      this.PARTS.description.template =
        "systems/cog/templates/sheets/item/description-advanced.hbs";
      this.TABS.description = [
        { id: "public", group: "description", label: "COG.ITEM.TABS.Public" },
        { id: "secret", group: "description", label: "COG.ITEM.TABS.Secret" },
      ];
    }
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(_options) {
    const tabGroups = this.#getTabs();

    return {
      // Sheet
      tabGroups,
      tabs: tabGroups.sheet,
      tabsPartial: this.constructor.PARTS.tabs.template,

      // Data
      name: { field: this.document.schema.getField("name"), value: this.document.name },
      img: { field: this.document.schema.getField("img"), value: this.document.img },
      description: await this.#prepareDescription(),
    };
  }

  /* -------------------------------------------- */

  /**
   * Configure the tabs used by this sheet.
   * @returns {Record<string, Record<string, ApplicationTab>>}
   * @protected
   */
  #getTabs() {
    const tabs = {};
    for (const [groupId, config] of Object.entries(this.constructor.TABS)) {
      const group = {};
      for (const t of config) {
        const active = this.tabGroups[t.group] === t.id;
        group[t.id] = Object.assign({ active, cssClass: active ? "active" : "" }, t);
      }
      tabs[groupId] = group;
    }

    return tabs;
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Description on the item sheet.
   * @returns {{
   *   wounds: { any: { enriched: string } };
   * }}
   */
  async #prepareDescription() {
    const description = {
      public: this.makeField("description.public"),
      ...(this.document.system.description.secret && {
        secret: this.makeField("description.secret"),
      }),
    };

    const context = {
      relativeTo: this.document,
      secrets: this.document.isOwner,
    };

    for (const key in description) {
      description[key].enriched = await TextEditor.enrichHTML(description[key].value, context);
    }

    return description;
  }

  /* -------------------------------------------- */
  /*  Actions Event Handlers
  /* -------------------------------------------- */

  /**
   * Edit the Item profile image.
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
}
