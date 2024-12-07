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
      template: undefined, // Defined during _initializeActorSheetClass
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
    sheet: [
      {
        id: "attributes",
        group: "sheet",
        icon: "fa-duotone fa-solid fa-chart-simple",
        label: "COG.ACTOR.TABS.Attributes",
      },
    ],
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
    this.PARTS.sidebar.template = `systems/cog/templates/sheets/actor/${actor.type}/sidebar.hbs`;
    this.PARTS.header.template = `systems/cog/templates/sheets/actor/${actor.type}/header.hbs`;
    this.PARTS.attributes.template = `systems/cog/templates/sheets/actor/${actor.type}/attributes.hbs`;
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
        icon: "fa-solid fa-bolt",
        padded: true,
        label: "COG.ACTOR.TABS.Actions",
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
        icon: "fa-duotone fa-solid fa-layer-group",
        label: "COG.ACTOR.TABS.Inventory",
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
        icon: "fa-duotone fa-regular fa-code-branch",
        label: "COG.ACTOR.TABS.Paths",
      });
      this.TABS.paths = [
        {
          id: "species",
          group: "paths",
          icon: "fa-duotone fa-solid fa-dna",
          label: "COG.ACTOR.PATH_TABS.Species",
        },
        {
          id: "cultural",
          group: "paths",
          icon: "fa-duotone fa-solid fa-masks-theater",
          label: "COG.ACTOR.PATH_TABS.Cultural",
        },
        {
          id: "hobby",
          group: "paths",
          icon: "fa-duotone fa-regular fa-palette",
          label: "COG.ACTOR.PATH_TABS.Hobby",
        },
        {
          id: "expertise1",
          group: "paths",
          icon: "fa-duotone fa-solid fa-briefcase",
          label: "COG.ACTOR.PATH_TABS.Expertise",
        },
        {
          id: "expertise2",
          group: "paths",
          icon: "fa-duotone fa-solid fa-briefcase",
          label: "COG.ACTOR.PATH_TABS.Expertise",
        },
        {
          id: "prestige",
          group: "paths",
          icon: "fa-duotone fa-solid fa-medal",
          label: "COG.ACTOR.PATH_TABS.Prestige",
        },
      ];
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
        icon: "fa-regular fa-atom",
        padded: true,
        label: "COG.ACTOR.TABS.Effects",
      });
    }

    // Includes Biography
    if (actor.includesBiography) {
      this.PARTS.biography = {
        id: "biography",
        template: `systems/cog/templates/sheets/actor/${actor.type}/biography.hbs`,
      };
      this.TABS.sheet.push({
        id: "biography",
        group: "sheet",
        icon: "fa-duotone fa-solid fa-passport",
        label: "COG.ACTOR.TABS.Biography",
      });
    }
  }

  /* -------------------------------------------- */
  /*  Properties
  /* -------------------------------------------- */

  /** @override */
  get title() {
    return this.document.name;
  }

  /* -------------------------------------------- */
  /*  Sheet Context
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(_options) {
    return {
      // Sheet
      tabGroups: this._getTabs(),
      editMode: this.isEditable && this.#mode === this.constructor.MODES.EDIT,

      // Data
      name: { field: this.document.schema.getField("name"), value: this.document.name },
      img: { field: this.document.schema.getField("img"), value: this.document.img },
      abilities: this.#prepareAbilities(),
      health: this.#prepareHealth(),
      attributes: this.#prepareAttributes(),
      attacks: this.#prepareAttacks(),
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Abilities on the actor sheet.
   * @returns {{ values: { fgPath: string } }}
   */
  #prepareAbilities() {
    const abilities = {
      ...this.makeField("abilities"),
      values: {},
    };

    for (const key in this.document.system.abilities) {
      abilities.values[key] = {
        ...this.makeField(`abilities.${key}`),
        base: this.makeField(`abilities.${key}.base`),
        max: this.makeField(`abilities.${key}.max`),
      };

      // Foreground
      abilities.values[key].fgPath = `/systems/cog/ui/actor/abilities/${key}.webp`;
    }

    return abilities;
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Health attributes on the actor sheet.
   * @returns {{
   *   fgPath: string;
   *   hitPoints: { pct: string; cssPct: string };
   *   tempDmgs: { pct: string; cssPct: string; value: number | null };
   * }}
   */
  #prepareHealth() {
    const health = {
      hitPoints: {
        ...this.makeField("health.hitPoints"),
        value: this.makeField("health.hitPoints.value"),
        base: this.makeField("health.hitPoints.base"),
        max: this.makeField("health.hitPoints.max"),
      },
      tempDmgs: this.makeField("health.tempDmgs"),
    };

    // Foreground
    health.fgPath = `/systems/cog/ui/actor/health/${this.document.type}-health-pool.webp`;

    // Hit Points
    health.hitPoints.pct = health.hitPoints.max.value
      ? Math.round((health.hitPoints.value.value * 100) / health.hitPoints.max.value)
      : 0;

    health.hitPoints.cssPct = `--hitPoints-pct: ${health.hitPoints.pct}%;`;

    // Temp Dmgs
    health.tempDmgs.pct = health.hitPoints.max.value
      ? Math.min(Math.round((health.tempDmgs.value * 100) / health.hitPoints.max.value) || 0, 100)
      : 0;

    health.tempDmgs.cssPct = `--tempDmgs-pct: ${health.tempDmgs.pct}%;`;
    if (health.tempDmgs.value === 0) health.tempDmgs.value = null;

    return health;
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Attributes on the actor sheet.
   * @returns {{
   *   wounds: { count: { pips: [n: number, filled: boolean, label: string] } };
   * }}
   */
  #prepareAttributes() {
    const attributes = {
      size: this.makeField("attributes.size"),
      initiative: {
        ...this.makeField("attributes.initiative"),
        base: this.makeField("attributes.initiative.base"),
        max: this.makeField("attributes.initiative.max"),
      },
      wounds: {
        ...this.makeField("attributes.wounds"),
        threshold: {
          ...this.makeField("attributes.wounds.threshold"),
          base: this.makeField("attributes.wounds.threshold.base"),
          max: this.makeField("attributes.wounds.threshold.max"),
        },
        count: this.makeField("attributes.wounds.count"),
      },
    };

    // Pips
    attributes.wounds.count.pips = Array.fromRange(4, 1).map((n) => ({
      n,
      filled: attributes.wounds.count.value >= n,
      label:
        attributes.wounds.count.value === n
          ? `${attributes.wounds.count.field.options.pips}.equal`
          : attributes.wounds.count.value > n
            ? `${attributes.wounds.count.field.options.pips}.lesser`
            : `${attributes.wounds.count.field.options.pips}.greater`,
    }));

    return attributes;
  }

  /* -------------------------------------------- */

  /**
   * Prepare and format the display of Attacks on the actor sheet.
   * @returns {{ values: { fgPath: string } }}
   */
  #prepareAttacks() {
    const attacks = {
      ...this.makeField("attacks"),
      values: {},
    };

    for (const key in this.document.system.attacks) {
      attacks.values[key] = {
        ...this.makeField(`attacks.${key}`),
        base: this.makeField(`attacks.${key}.base`),
        max: this.makeField(`attacks.${key}.max`),
      };

      // Foreground
      attacks.values[key].fgPath = `/systems/cog/ui/actor/attacks/${key}.webp`;
    }

    return attacks;
  }

  /* -------------------------------------------- */
  /*  Sheet Rendering
  /* -------------------------------------------- */

  /** @inheritDoc */
  _attachFrameListeners() {
    super._attachFrameListeners();

    // Automatic select of input values
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

  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);

    if (this.isEditable) {
      // Hit Points toggle
      this.element
        .querySelector(".hit-points > .label")
        ?.addEventListener("click", this.#onToggleHitPoints.bind(this));
      this.element
        .querySelector(".hit-points > .field > input")
        ?.addEventListener("blur", this.#onToggleHitPoints.bind(this));

      // Pips
      for (const pips of this.element.querySelectorAll(".pips[data-prop]")) {
        pips.addEventListener("click", this.#onTogglePip.bind(this));
      }
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
    toggle.dataset.tooltip = "COG.ACTOR.MODES.Edit";
    toggle.dataset.tooltipClass = "cog";
    toggle.setAttribute("aria-label", game.i18n.localize("COG.ACTOR.MODES.Edit"));

    // Add it to the DOM
    header.insertAdjacentElement("afterbegin", toggle);

    return toggle;
  }

  /* -------------------------------------------- */
  /*  Actions Event Handlers
  /* -------------------------------------------- */

  /**
   * Handle spawning the application of various actor configuration profiles.
   * @param {PointerEvent} event   The triggering event.
   * @param {HTMLElement}  target  The targeted dom element.
   */
  static #onConfigure(event, target) {
    const profile = target.dataset.configureProfile;

    if (profile in this.options.configureProfiles) {
      const options = {};
      if (target.dataset.key) options.key = target.dataset.key;

      const app = new this.options.configureProfiles[profile]({ document: this.actor, ...options });
      app.render(true);
    }
  }

  /* -------------------------------------------- */
  /*  Others Event Handlers
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
    if (
      event.target.tagName === "INPUT" &&
      event.target.type === "number" &&
      event.target.parentElement.classList.contains("relative-input")
    ) {
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
    const label = game.i18n.localize(`COG.ACTOR.MODES.${toggle.checked ? "Play" : "Edit"}`);

    toggle.dataset.tooltip = label;
    toggle.setAttribute("aria-label", label);

    this.#mode = toggle.checked ? MODES.EDIT : MODES.PLAY;

    await this.submit();
    this.render();
  }

  /* -------------------------------------------- */

  /**
   * Handle the user toggling the Hit Points input.
   * @param {PointerEvent} event  The triggering event.
   */
  #onToggleHitPoints(event) {
    const hitPoints = event.currentTarget.closest(".hit-points");
    const label = hitPoints.querySelector(":scope > .label");
    const field = hitPoints.querySelector(":scope > .field");
    const input = field.querySelector(":scope > input");

    if (label && field && input) {
      label.classList.toggle("hidden");
      field.classList.toggle("hidden");
      if (!field.classList.contains("hidden")) input.focus();
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle toggling a pip on the character sheet.
   * @param {PointerEvent} event  The triggering event.
   */
  #onTogglePip(event) {
    const n = Number(event.target.closest("[data-n]")?.dataset.n);
    if (!n || isNaN(n)) return;
    const prop = event.currentTarget.dataset.prop;
    let value = foundry.utils.getProperty(this.document.system, prop);
    if (value === n) value--;
    else value = n;
    this.actor.update({ [`system.${prop}`]: value });
  }
}
