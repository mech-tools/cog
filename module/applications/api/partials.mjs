/**
 * Load all partials defined within the COG system.
 * @returns {Record<string, string>}
 */
export default async function preloadHandlebarsTemplates() {
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
