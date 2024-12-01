import COGActorType from "./actor-type.mjs";

/**
 * Data schema, attributes, and methods specific to Npc type Actors.
 */
export default class COGNpc extends COGActorType {
  /** @override */
  static LOCALIZATION_PREFIXES = ["COG.ACTOR", "COG.NPC"];

  /* -------------------------------------------- */
  /*  Database Workflows
  /* -------------------------------------------- */

  /** @override */
  async _preCreate(_data, _options, _user) {
    const prototypeToken = {
      bar1: { attribute: "health.hitPoints" },
      sight: { enabled: true },
      displayBars: CONST.TOKEN_DISPLAY_MODES.OWNER,
      actorLink: false,
      disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
    };

    this.parent.updateSource({ prototypeToken });
  }

  /* -------------------------------------------- */
  /*  Data Schema
  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const required = { required: true, nullable: false };
    const requiredInteger = { ...required, integer: true };
    const schema = super.defineSchema();

    // advancement
    schema.advancement = new fields.SchemaField({
      cr: new fields.NumberField({ ...required, initial: 0, min: 0, step: 0.5 }),
    });

    // Defenses
    const defenseTypes = ["physical", "psy"];

    schema.defenses = new fields.SchemaField({
      protection: new fields.SchemaField(
        defenseTypes.reduce((obj, id) => {
          obj[id] = new fields.SchemaField({
            base: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
            max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          });
          return obj;
        }, {}),
      ),
      reduction: new fields.SchemaField({
        base: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
    });

    // Remove unused fields
    for (const key in schema.abilities.fields) {
      delete schema.abilities.fields[key].fields.bonus;
    }
    delete schema.health.fields.hitPoints.fields.bonus;
    delete schema.attributes.fields.initiative.fields.bonus;
    delete schema.attributes.fields.wounds.fields.threshold.fields.bonus;
    for (const key in schema.attacks.fields) {
      delete schema.attacks.fields[key].fields.bonus;
      delete schema.attacks.fields[key].fields.increases;
    }

    return schema;
  }

  /* -------------------------------------------- */
  /*  Derived Data Preparation
  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAbilities() {
    for (const key in this.abilities) {
      this.abilities[key].max = this.abilities[key].base;
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _prepareDerivedHealth() {
    this.health.hitPoints.max = this.health.hitPoints.base;

    super._prepareDerivedHealth();
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAttributes() {
    this.attributes.initiative.max = this.attributes.initiative.base;
    this.attributes.wounds.threshold.max = this.attributes.wounds.threshold.base;
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedAttacks() {
    for (const key in this.attacks) {
      this.attacks[key].max = this.attacks[key].base;
    }
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareDerivedDefenses() {
    for (const key in this.defenses.protection) {
      this.defenses.protection[key].max = this.defenses.protection[key].base;
    }

    this.defenses.reduction.max = this.defenses.reduction.base;
  }
}
