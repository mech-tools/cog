/**
 * The Actor document subclass in the COG system which extends the behavior of the base Actor class.
 */
export default class COGActor extends Actor {

  /**
   * Does the Actor have a Hit Dice field.
   * @returns {boolean}
   */
  get hasHitDie() {
    return "HIT_DIE" in this.system;
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

    // Reset Hit Die History when level changes
    const newLevel = data.system?.ADVANCEMENT?.level?.value;
    if (newLevel) {
      for (const key of Object.keys(this.system.HIT_DIE.history)) {
        if (parseInt(key.replace("level", "")) > newLevel) {
          updates[`system.HIT_DIE.history.${key}.value`] =
            SYSTEM.ACTOR.HIT_DIE.history[key].value_initial;
        }
      }
    }

    // Apply new updates
    Object.assign(data, updates);
  }
}
