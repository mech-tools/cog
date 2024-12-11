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
    actions: {},
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
      template: "systems/cog/templates/sheets/item/partials/item-nav.hbs",
    },
    description: {
      id: "description",
      template: "systems/cog/templates/sheets/item/description.hbs",
    },
    config: {
      id: "config",
      template: undefined, // Defined during _initializeItemSheetClass
      scrollable: [""],
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
    return {
      // Sheet
      tabGroups: this._getTabs(),

      // Data
      img: { field: this.document.schema.getField("img"), value: this.document.img },
      name: { field: this.document.schema.getField("name"), value: this.document.name },
      tags: this.document.system.tags,
      description: await this.#prepareDescription(),
    };
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

    // Enrich HTML
    const EditorContext = {
      relativeTo: this.document,
      secrets: this.document.isOwner,
    };

    for (const key in description) {
      description[key].enriched = await TextEditor.enrichHTML(
        description[key].value,
        EditorContext,
      );
    }

    return description;
  }

  /* -------------------------------------------- */
  /*  Sheet Rendering
  /* -------------------------------------------- */

  /** @inheritDoc */
  _onRender(context, options) {
    super._onRender(context, options);

    const dropZones = this.element.querySelectorAll(".drop-zone");

    for (const dropZone of dropZones) {
      dropZone.addEventListener("drop", this._onDropItem.bind(this));
    }
  }

  /* -------------------------------------------- */

  /**
   * Handles the dropping of an item into the item.
   * @param {DragEvent} _event  The triggering event.
   */
  _onDropItem(_event) {}
}
