/* --------------------------------------------- */
/* Chroniques Oubliées Galactiques Game System
/* Author: Maxime
/* Software License: MIT
/* Repository: https://github.com/mech-tools/cog
/* --------------------------------------------- */

// Configuration
import { COG } from "./module/config/_module.mjs";
globalThis.COG = COG;

// Import Modules
import * as applications from "./module/applications/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as models from "./module/models/_module.mjs";
import * as components from "./module/components/_module.mjs";

/* -------------------------------------------- */
/*  Foundry VTT Initialization
/* -------------------------------------------- */

Hooks.once("init", async function () {
  console.log(`Initializing Chroniques Oubliées Galactiques game system.`);

  // Expose the system API
  CONFIG.COG = {
    config: COG,
    applications,
    models,
    documents,
    components,
  };

  // Actor Document configuration
  CONFIG.Actor.documentClass = documents.COGActor;
  CONFIG.Actor.dataModels = {
    pc: models.actor.COGPc,
    npc: models.actor.COGNpc,
  };
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(COG.id, applications.actor.PcSheet, {
    types: ["pc"],
    makeDefault: true,
  });
  Actors.registerSheet(COG.id, applications.actor.NpcSheet, {
    types: ["npc"],
    makeDefault: true,
  });

  // Item document configuration
  CONFIG.Item.documentClass = documents.COGItem;
  CONFIG.Item.dataModels = {
    feature: models.item.COGFeature,
  };
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(COG.id, applications.item.FeatureSheet, {
    types: ["feature"],
    makeDefault: true,
  });

  // Handlebars utils
  applications.api.utils.preloadHandlebarsTemplates();
  applications.api.utils.registerHandlebarsHelpers();
});

// Other Document Configuration
CONFIG.Token.documentClass = documents.COGToken;

/* -------------------------------------------- */
/*  Localization
/* -------------------------------------------- */

Hooks.once("i18nInit", function () {
  // Apply localizations
  const toLocalize = ["HIT_DIE_TYPES", "SIZES"];
  for (let loc of toLocalize) {
    const conf = foundry.utils.getProperty(COG, loc);

    // Special handling for enums
    if (conf instanceof COG.API.Enum) {
      for (const [key, label] of Object.entries(conf.labels))
        conf.labels[key] = game.i18n.localize(label);
      Object.freeze(conf.labels);
      continue;
    }
  }
});
