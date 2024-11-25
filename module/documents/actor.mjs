/**
 * The Actor document subclass in the COG system which extends the behavior of the base Actor class.
 */
export default class COGActor extends Actor {

  /* -------------------------------------------- */
  /*  Properties
  /* -------------------------------------------- */

  /**
   * Get the filtered Hit Die history based on the Actor current level (PC only).
   * @returns {Array}
   */
  get currentHitDieHistory() {
    return Object.entries(this.system.hitDie.history)
      .filter(([level, value]) => parseInt(level) <= this.system.advancement.level);
  }

  /* -------------------------------------------- */

  /**
   * Get the attacks increases delta based on the Actor current level (PC only).
   * @returns {number}
   */
  get increasesDelta() {
    return Object.values(this.system.attacks).reduce((count, { increases }) => count + increases, 0) -
      this.system.advancement.level;
  }

  /* -------------------------------------------- */
  /*  Database Workflows
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
      case "pc":
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
  async _preUpdate(changes, options, user) {
    await super._preUpdate(changes, options, user);

    this.#resetHitDieHistory(changes);
  }

  /* -------------------------------------------- */

  /**
   * Reset Hit Die History for levels that are below the new level.
   * @param {Object} changes  The changes applied to the Document.
   * @returns {void}
   */
  #resetHitDieHistory(changes) {
    const newLevel = changes.system?.advancement?.level;

    // Exit early of no relevant changes
    if (!newLevel || newLevel >= this.system.advancement.level) return;

    const updates = {};

    for (const level of Object.keys(this.system.hitDie.history)) {
      if (parseInt(level) > newLevel) {
        updates[`system.hitDie.history.${level}`] = null;
      }
    }

    Object.assign(changes, updates);
  }
}
