/** @import {SYSTEM} from  "SYSTEM" */
/** @import {SCHEMA} from  "MODELS" */

import HitPointsConfigSheet from "./config/hit-points-config-sheet.mjs";

const { api, sheets } = foundry.applications;

/**
 * A base ActorSheet built on top of ApplicationV2 and the Handlebars rendering backend.
 */
export default class COGBaseActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["cog", "actor", "standard-form"],
    position: {
      width: 900,
      height: 750,
    },
    actions: {
      editImage: COGBaseActorSheet.#onEditImage,
      configure: COGBaseActorSheet.#onConfigure,
    },
    form: {
      submitOnChange: true,
    },
    actor: {
      type: undefined, // Defined by subclass
      includesActions: false,
      includesInventory: false,
      includesPaths: false,
      includesEffects: false,
      includesBiography: false,
    },
    configureProfiles: {
      hitPoints: HitPointsConfigSheet,
    },
  };

  /** @override */
  static PARTS = {
    tabs: {
      id: "tabs",
      template: "systems/cog/templates/sheets/actor/tabs.hbs",
    },
    sidebar: {
      id: "sidebar",
      template: "systems/cog/templates/sheets/actor/sidebar.hbs", // Defined during _initializeActorSheetClass
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
    sheet: [{ id: "attributes", group: "sheet", label: "SHEET.ACTOR.TABS.Attributes" }],
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
        label: "SHEET.ACTOR.TABS.Actions",
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
        label: "SHEET.ACTOR.TABS.Inventory",
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
        label: "SHEET.ACTOR.TABS.Paths",
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
        label: "SHEET.ACTOR.TABS.Effects",
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
        label: "SHEET.ACTOR.TABS.Biography",
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
      source: this.document.toObject(),

      // Sheet
      tabGroups,
      tabs: tabGroups.sheet,
      editMode: this.isEditable && this.#mode === this.constructor.MODES.EDIT,

      // Data
      health: this.#prepareHealth(),
      advancement: this.#prepareAdvancement(),
      attributes: this.#prepareAttributes(),
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Health attributes on the actor sheet.
   * @returns {SCHEMA.ACTOR.HEALTH &
   *   SYSTEM.ACTOR.HEALTH & {
   *     fgPath: string;
   *     hitPoints: { pct: string; cssPct: string };
   *     tempDmgs: { pct: string; cssPct: string };
   *     hitDie?: { icon: string };
   *   }}
   */
  #prepareHealth() {
    // Merge Data with System Config
    const health = foundry.utils.mergeObject(this.document.system.health, SYSTEM.ACTOR.HEALTH, {
      inplace: false,
    });

    // Hit Points percentage
    health.hitPoints.pct = Math.round((health.hitPoints.value * 100) / health.hitPoints.max);
    health.hitPoints.cssPct = `--hitPoints-pct: ${health.hitPoints.pct}%;`;

    // Temp Damages percentage
    health.tempDmgs.pct = Math.min(
      Math.round((health.tempDmgs.value * 100) / health.hitPoints.max) || 0,
      100,
    );
    health.tempDmgs.cssPct = `--tempDmgs-pct: ${health.tempDmgs.pct}%;`;
    if (health.tempDmgs.value === 0) health.tempDmgs.value = null;

    // Icons
    health.fgPath = `systems/cog/ui/actor/health/${this.document.type}-health-pool.webp`;
    if (this.document.hasHitDie)
      health.hitDie.icon = `systems/cog/ui/dice/d${this.document.system.health.hitDie.value}.svg`;

    return health;
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Health attributes on the actor sheet.
   * @returns {SCHEMA.ACTOR.ADVANCEMENT &
   *   SYSTEM.ACTOR.ADVANCEMENT & { nc?: { formattedValue: string } }}
   */
  #prepareAdvancement() {
    // Merge Data with System Config
    const advancement = foundry.utils.mergeObject(
      this.document.system.advancement,
      SYSTEM.ACTOR.ADVANCEMENT,
      { inplace: false },
    );

    return advancement;
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Attributes on the actor sheet.
   * @returns {SCHEMA.ACTOR.ATTRIBUTES &
   *   SYSTEM.ACTOR.ATTRIBUTES & { size: { formattedValue: string } }}
   */
  #prepareAttributes() {
    // Merge Data with System Config
    const attributes = foundry.utils.mergeObject(
      this.document.system.attributes,
      SYSTEM.ACTOR.ATTRIBUTES,
      { inplace: false },
    );

    // Format Size value
    attributes.size.formattedValue = SYSTEM.ACTOR.SIZES.label(attributes.size.value);

    return attributes;
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
    toggle.dataset.tooltip = "SHEET.ACTOR.MODES.Edit";
    toggle.dataset.tooltipClass = "cog";
    toggle.setAttribute("aria-label", game.i18n.localize("SHEET.ACTOR.MODES.Edit"));

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
    const label = game.i18n.localize(`SHEET.ACTOR.MODES.${toggle.checked ? "Play" : "Edit"}`);

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
