import { get, override } from "@homer0/prettier-plugin-jsdoc/src/fns/app.js";
import { loadFns } from "@homer0/prettier-plugin-jsdoc/src/loader.js";
import { getPlugin } from "@homer0/prettier-plugin-jsdoc/src/fns/getPlugin.js";
import { getRenderer } from "@homer0/prettier-plugin-jsdoc/src/fns/getParsers.js";
import { render } from "@homer0/prettier-plugin-jsdoc/src/fns/render.js";

loadFns();

const customGetRenderer = (options) => {
  const renderer = get(render)(options);
  return (column, block) => {
    const padding = " ".repeat(column + 1);
    const prefix = `${padding}* `;
    const lines = renderer(column, block);

    if (
      lines.length === 1 &&
      block.tags.length > 0 &&
      options.jsdocUseInlineCommentForASingleTagBlock
    ) {
      return `* ${lines[0]} `;
    }

    const useLines = lines.map((line) => `${prefix}${line}`).join("\n");

    return `*\n${useLines}\n${padding}`;
  };
};

override(getRenderer, customGetRenderer);

export default get(getPlugin)();
