import COGBaseSheet from "../api/base-sheet.mjs";

const { sheets } = foundry.applications;

/**
 * A base ActorSheet built on top of ApplicationV2 and the Handlebars rendering backend.
 */
export default class COGBaseActorSheet extends COGBaseSheet(sheets.ActorSheetV2) {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["actor"],
    position: {
      width: 900,
      height: 750,
    },
    actions: {
      editImage: COGBaseActorSheet.#onEditImage,
      configure: COGBaseActorSheet.#onConfigure,
    },
    actor: {
      type: undefined, // Defined by subclass
      includesActions: false,
      includesInventory: false,
      includesPaths: false,
      includesEffects: false,
      includesBiography: false,
    },
    configureProfiles: {}, // Defined by subclass
  };

  /** @override */
  static PARTS = {
    tabs: {
      id: "tabs",
      template: "systems/cog/templates/sheets/actor/tabs.hbs",
    },
    sidebar: {
      id: "sidebar",
      template: "systems/cog/templates/sheets/actor/sidebar.hbs",
    },
    body: {
      id: "body",
      template: "systems/cog/templates/sheets/actor/body.hbs",
    },
    header: {
      id: "header",
      template: undefined, // Defined during _initializeActorSheetClass
    },
    attributes: {
      id: "attributes",
      template: undefined, // Defined during _initializeActorSheetClass
    },
  };

  /**
   * Define the structure of tabs used by this Actor Sheet.
   */
  static TABS = {
    sheet: [{ id: "attributes", group: "sheet", label: "COG.SHEET.ACTOR.TABS.Attributes" }],
  };

  /** @override */
  tabGroups = {
    sheet: "attributes",
  };

  /**
   * Available sheet modes.
   * @enum {number}
   */
  static MODES = {
    PLAY: 1,
    EDIT: 2,
  };

  /**
   * The mode the sheet is currently in.
   * @type {COGBaseActorSheet.MODES}
   */
  #mode = COGBaseActorSheet.MODES.PLAY;

  /* -------------------------------------------- */

  /**
   * A method which can be called by subclasses in a static initialization block to refine
   * configuration options at the class level.
   */
  static _initializeActorSheetClass() {
    const actor = this.DEFAULT_OPTIONS.actor;
    this.PARTS = foundry.utils.deepClone(this.PARTS);
    this.TABS = foundry.utils.deepClone(this.TABS);

    // Actor Type Configuration
    this.PARTS.header.template = `systems/cog/templates/sheets/actor/${actor.type}-header.hbs`;
    this.PARTS.attributes.template = `systems/cog/templates/sheets/actor/${actor.type}-attributes.hbs`;
    this.DEFAULT_OPTIONS.classes = [actor.type];

    // Includes Actions
    if (actor.includesActions) {
      this.PARTS.actions = {
        id: "actions",
        template: "systems/cog/templates/sheets/actor/actions.hbs",
      };
      this.TABS.sheet.push({
        id: "actions",
        group: "sheet",
        label: "COG.SHEET.ACTOR.TABS.Actions",
      });
    }

    // Includes Inventory
    if (actor.includesInventory) {
      this.PARTS.inventory = {
        id: "inventory",
        template: "systems/cog/templates/sheets/actor/inventory.hbs",
      };
      this.TABS.sheet.push({
        id: "inventory",
        group: "sheet",
        label: "COG.SHEET.ACTOR.TABS.Inventory",
      });
    }

    // Includes Paths
    if (actor.includesPaths) {
      this.PARTS.paths = {
        id: "paths",
        template: "systems/cog/templates/sheets/actor/paths.hbs",
      };
      this.TABS.sheet.push({
        id: "paths",
        group: "sheet",
        label: "COG.SHEET.ACTOR.TABS.Paths",
      });
    }

    // Includes Effects
    if (actor.includesEffects) {
      this.PARTS.effects = {
        id: "effects",
        template: "systems/cog/templates/sheets/actor/effects.hbs",
      };
      this.TABS.sheet.push({
        id: "effects",
        group: "sheet",
        label: "COG.SHEET.ACTOR.TABS.Effects",
      });
    }

    // Includes Biography
    if (actor.includesBiography) {
      this.PARTS.biography = {
        id: "biography",
        template: `systems/cog/templates/sheets/actor/${actor.type}-biography.hbs`,
      };
      this.TABS.sheet.push({
        id: "biography",
        group: "sheet",
        label: "COG.SHEET.ACTOR.TABS.Biography",
      });
    }
  }

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /** @override */
  get title() {
    return this.document.name;
  }

  /* -------------------------------------------- */
  /*  Sheet Context                               */
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(_options) {
    const tabGroups = this.#getTabs();

    return {
      // Document
      actor: this.document,
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      isEditable: this.isEditable,

      // Sheet
      tabGroups,
      tabs: tabGroups.sheet,
      editMode: this.isEditable && this.#mode === this.constructor.MODES.EDIT,

      // Data
      HEALTH: this.#prepareHealth(),
      ADVANCEMENT: this.getField("ADVANCEMENT"),
      ATTRIBUTES: this.getField("ATTRIBUTES"),
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Health attributes on the actor sheet.
   * @returns {Object & {
   *   fgPath: string;
   *   hitPoints: { pct: string; cssPct: string };
   *   tempDmgs: { pct: string; cssPct: string };
   * }}
   */
  #prepareHealth() {
    // Hit Points
    const hitPoints = {
      value: this.getField("HEALTH.hitPoints.value"),
      max: this.getField("HEALTH.hitPoints.max"),
    };

    hitPoints.pct = hitPoints.max.value
      ? Math.round((hitPoints.value.value * 100) / hitPoints.max.value)
      : 0;

    hitPoints.cssPct = `--hitPoints-pct: ${hitPoints.pct}%;`;

    // Temp Dmgs
    const tempDmgs = {
      value: this.getField("HEALTH.tempDmgs.value"),
    };

    tempDmgs.pct = hitPoints.max.value
      ? Math.min(Math.round((tempDmgs.value.value * 100) / hitPoints.max.value) || 0, 100)
      : 0;

    tempDmgs.cssPct = `--tempDmgs-pct: ${tempDmgs.pct}%;`;
    if (tempDmgs.value.value === 0) tempDmgs.value.value = null;

    return {
      fgPath: `systems/cog/ui/actor/health/${this.document.type}-health-pool.webp`,
      hitPoints,
      tempDmgs,
    };
  }

  /* -------------------------------------------- */
  /*  Sheet Rendering                             */
  /* -------------------------------------------- */

  /**
   * Configure the tabs used by this sheet.
   * @returns {Record<string, Record<string, ApplicationTab>>}
   */
  #getTabs() {
    const tabs = {};

    for (const [groupId, config] of Object.entries(this.constructor.TABS)) {
      const group = {};

      for (const t of config) {
        const active = this.tabGroups[t.group] === t.id;
        const icon = `systems/cog/ui/actor/tabs/${t.id}.svg`;

        group[t.id] = {
          active,
          cssClass: active ? "active" : "",
          icon,
          ...t,
        };
      }

      tabs[groupId] = group;
    }

    return tabs;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  _attachFrameListeners() {
    super._attachFrameListeners();

    // Automatic select of inpunt values
    this.element.addEventListener("focusin", this.#onFocusIn.bind(this));
  }

  /* -------------------------------------------- */

  /** @override */
  _onFirstRender(context, options) {
    super._onFirstRender(context, options);

    // Edit Mode toggle
    const toggle = this.#addEditToggle();
    toggle.addEventListener("change", this.#onChangeSheetMode.bind(this));
    toggle.addEventListener("dblclick", (event) => event.stopPropagation());
  }

  /* -------------------------------------------- */

  /** @override */
  _onRender(_context, _options) {
    if (this.isEditable) {
      // Hit Points toggle
      this.element
        .querySelector(".hit-points > .label")
        .addEventListener("click", this.#onToggleHitPoints.bind(this));
      this.element
        .querySelector(".hit-points > .field > input")
        .addEventListener("blur", this.#onToggleHitPoints.bind(this));
    }
  }

  /* -------------------------------------------- */

  /**
   * Add a toggle button allowing the user to edit the sheet.
   * @returns {HTMLElement}
   */
  #addEditToggle() {
    // Create element
    const header = this.element.querySelector(".window-header");

    // Add css classes
    const toggle = document.createElement("slide-toggle");
    toggle.classList.add("mode-slider");

    // Default value
    toggle.checked = this.#mode === this.constructor.MODES.EDIT;

    // Label and tooltip
    toggle.dataset.tooltip = "COG.SHEET.ACTOR.MODES.Edit";
    toggle.dataset.tooltipClass = "cog";
    toggle.setAttribute("aria-label", game.i18n.localize("COG.SHEET.ACTOR.MODES.Edit"));

    // Add it to the DOM
    header.insertAdjacentElement("afterbegin", toggle);

    return toggle;
  }

  /* -------------------------------------------- */
  /*  Actions Event Handlers                      */
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

  /**
   * Handle spawning the application of various actor configuration profiles.
   * @param {PointerEvent} event   The triggering event.
   * @param {HTMLElement}  target  The targeted dom element.
   */
  static #onConfigure(event, target) {
    const profile = target.dataset.configureProfile;

    if (profile in this.options.configureProfiles) {
      const app = new this.options.configureProfiles[profile]({ document: this.actor });
      app.render(true);
    }
  }

  /* -------------------------------------------- */
  /*  Others Event Handlers                      */
  /* -------------------------------------------- */

  /** @inheritDoc */
  _onChangeForm(formConfig, event) {
    // Support relative input for number fields
    if (event.target.name && event.target.classList.contains("number-input")) {
      if (["+", "-"].includes(event.target.value[0])) {
        const v0 = foundry.utils.getProperty(this.document, event.target.name);
        const delta = Number(event.target.value);

        event.target.type = "number";
        event.target.valueAsNumber = v0 + delta;
      } else if (event.target.value[0] === "=") {
        const value = Number(event.target.value.slice(1));

        event.target.type = "number";
        event.target.valueAsNumber = value;
      }
    }

    super._onChangeForm(formConfig, event);
  }

  /* -------------------------------------------- */

  /**
   * Select inputs when and convert number to text when focused.
   * @param {FocusEvent} event  The triggering event.
   */
  #onFocusIn(event) {
    if (event.target.tagName === "INPUT" && event.target.type === "number") {
      event.target.type = "text";
      event.target.classList.add("number-input");
    }

    if (event.target.tagName === "INPUT") {
      event.target.select();
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle the user toggling the sheet mode.
   * @param {InputEvent} event  The triggering event.
   */
  async #onChangeSheetMode(event) {
    const { MODES } = this.constructor;

    const toggle = event.currentTarget;
    const label = game.i18n.localize(`COG.SHEET.ACTOR.MODES.${toggle.checked ? "Play" : "Edit"}`);

    toggle.dataset.tooltip = label;
    toggle.setAttribute("aria-label", label);

    this.#mode = toggle.checked ? MODES.EDIT : MODES.PLAY;

    await this.submit();
    this.render();
  }

  /**
   * Handle the user toggling the Hit Points input.
   * @param {PointerEvent} event  The triggering event.
   */
  #onToggleHitPoints(event) {
    const hitPoints = event.currentTarget.closest(".hit-points");
    const label = hitPoints.querySelector(":scope > .label");
    const field = hitPoints.querySelector(":scope > .field");
    const input = field.querySelector(":scope > input");

    label.classList.toggle("hidden");
    field.classList.toggle("hidden");
    if (!field.classList.contains("hidden")) input.focus();
  }
}
