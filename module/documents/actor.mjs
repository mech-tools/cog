import SystemDocument from "./api/system-document.mjs";

/**
 * The Actor document subclass in the COG system which extends the behavior of the base Actor class.
 */
export default class COGActor extends SystemDocument(Actor) {

  static SYSTEM_PATH = "ACTOR";

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Does the Actor have a Hit Dice field.
   * @returns {boolean}
   */
  get hasHitDie() {
    return "hitDie" in this.system;
  }

  /* -------------------------------------------- */
  /*  Database Workflows                          */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // Automatic Prototype Token configuration
    const prototypeToken = {
      bar1: { attribute: "health.hitPoints" },
      sight: { enabled: true },
    };

    switch (data.type) {
      case "character":
        Object.assign(prototypeToken, {
          displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
          actorLink: true,
          disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
        });
        break;
      case "npc":
        Object.assign(prototypeToken, {
          displayBars: CONST.TOKEN_DISPLAY_MODES.OWNER,
          actorLink: false,
          disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
        });
        break;
    }

    this.updateSource({ prototypeToken });
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preUpdate(data, options, user) {
    await super._preUpdate(data, options, user);

    const updates = {};

    // Reset Hit Die History when the level changes
    const newLevel = data.system?.advancement?.level?.value;
    if (newLevel && newLevel < this.system.advancement.level.value) {
      const history = this.withSystemMetadata("hitDie.history");
      for (const [key, lvl] of Object.entries(history)) {
        if (lvl._mt.level > newLevel) {
          updates[`system.hitDie.history.${key}.value`] = lvl._mt.value.initial;
        }
      }
    }

    // Apply new updates
    Object.assign(data, updates);
  }
}
