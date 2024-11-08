import globals from "globals";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  jsdoc.configs["flat/recommended-typescript-flavor-error"],

  {
    ignores: ["node_modules/"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      jsdoc,
    },
    rules: {
      ...js.configs.recommended.rules,

      // Required so eslint doesn't error about Foundry globals (we don't want to list all of them)
      "no-undef": "off",

      // Keep unused arguments in function & methods allowing to keep @overrided method signature
      "no-unused-vars": ["warn", { args: "none" }],

      // Do not force return description
      "jsdoc/require-returns-description": "off",
    },
    settings: {
      jsdoc: {
        preferredTypes: {
          ".<>": "<>",
          object: "Object",
        },
      },
    },
  },

  eslintConfigPrettier,
];
