export default {
  printWidth: 100,
  plugins: ["./tools/prettierPluginJsdoc.mjs", "@yikes2000/prettier-plugin-merge-extras"],

  // JsDoc configuration
  jsdocEnforceAccessTag: false,
  jsdocUseSingleQuotesForStringLiterals: true,
  jsdocUseDotForArraysAndObjects: false,
  jsdocReplaceTagsSynonyms: false,
  jsdocConsistentColumns: false,
  jsdocLinesBetweenDescriptionAndTags: 0,
  jsdocUseInlineCommentForASingleTagBlock: true,
  jsdocEnsureDescriptionsAreSentences: true,
  jsdocExperimentalFormatCommentsWithoutTags: true,

  // Merge extras configuration
  alignObjectProperties: "none",
  preserveLastBlankLine: false,
};
