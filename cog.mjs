/* --------------------------------------------- */
/* Chroniques Oubliées Galactiques Game System   */
/* Author: Maxime                                */
/* Software License: MIT                         */
/* Repository: https://github.com/mech-tools/cog */
/* --------------------------------------------- */

// Configuration
import { SYSTEM } from "./module/system/_module.mjs";
globalThis.SYSTEM = SYSTEM;

// Import Modules
import * as applications from "./module/applications/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as models from "./module/models/_module.mjs";
import * as components from "./module/components/_module.mjs";
import * as utils from "./module/utils/_modules.mjs";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function () {
  console.log(`Initializing Chroniques Oubliées Galactiques game system.`);
  globalThis.cog = game.system;
  game.system.CONST = SYSTEM;

  // Expose the system API
  game.system.api = {
    applications,
    models,
    documents,
    components,
    utils,
  };

  // Actor Document configuration
  CONFIG.Actor.documentClass = documents.COGActor;
  CONFIG.Actor.dataModels = {
    character: models.COGCharacter,
    npc: models.COGNpc,
  };
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(SYSTEM.id, applications.actor.CharacterSheet, {
    types: ["character"],
    makeDefault: true,
  });
  Actors.registerSheet(SYSTEM.id, applications.actor.NpcSheet, {
    types: ["npc"],
  });
});

// Other Document Configuration
CONFIG.Token.documentClass = documents.COGToken;

/* -------------------------------------------- */
/*  Localization                                */
/* -------------------------------------------- */

Hooks.once("i18nInit", function () {
  const objectsToLocalize = [
    "ACTOR.HIT_DIE_TYPES",
    "ACTOR.HIT_DIE_LEVEL_TYPES",
    "ACTOR.SIZES",
    "ACTOR.HIT_DIE",
    "ACTOR.HEALTH",
    "ACTOR.ADVANCEMENT",
    "ACTOR.ATTRIBUTES",
  ];

  for (let path of objectsToLocalize) {
    const obj = foundry.utils.getProperty(SYSTEM, path);

    // Special handling for enums
    if (obj instanceof utils.Enum) {
      for (const [key, label] of Object.entries(obj.labels)) {
        obj.labels[key] = game.i18n.localize(label);
      }

      Object.freeze(obj.labels);
      continue;
    }

    // Localize keys that ends with specific terms, also formatting data if a `${key}Data` property is found
    for (let [key, value] of Object.entries(foundry.utils.flattenObject(obj))) {
      for (let toLocalize of ["label", "hint", "abbreviation"]) {
        if (key.toLowerCase().endsWith(toLocalize)) {
          const formatData = foundry.utils.getProperty(obj, `${key}Data`) || {};
          foundry.utils.setProperty(obj, key, game.i18n.format(value, formatData));
        }
      }
    }
  }
});
