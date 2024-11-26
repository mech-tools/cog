/* ----------------------------------------- */
/* Partials
/* ----------------------------------------- */

/**
 * Load all partials defined within the COG system.
 * @returns {Record<string, string>}
 */
export async function preloadHandlebarsTemplates() {
  const partials = [
    "systems/cog/templates/sheets/actor/partials/actor-img.hbs",
    "systems/cog/templates/sheets/actor/partials/actor-name.hbs",
    "systems/cog/templates/sheets/actor/partials/actor-temp-dmgs.hbs",
  ];

  const paths = {};

  for (const path of partials) {
    paths[`cog.${path.split("/").pop().replace(".hbs", "")}`] = path;
  }

  return loadTemplates(paths);
}

/* ----------------------------------------- */
/* Helpers
/* ----------------------------------------- */

/**
 * Register custom Handlebars helpers.
 */
export function registerHandlebarsHelpers() {
  Handlebars.registerHelper({
    signedString,
  });
}

/* -------------------------------------------- */

/**
 * Format a number with signedString.
 * @param {string} value  The string to format.
 * @returns {string}
 */
function signedString(value) {
  return value.signedString();
}
