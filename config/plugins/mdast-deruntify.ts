import type { MdastPluginDefinition } from "./types.ts";

export const mdast_deruntify: MdastPluginDefinition = {
  name: "mdast-derutify",
  text(node, ctx) {
    const wordCount = node.value.split(" ").length;
    if (wordCount < 5) {
      ctx.setProperty(
        node,
        "value",
        node.value.replace(/ (?<lastWord>[^ ]*)$/u, "\u00A0$<lastWord>"),
      );
    }
  },
};
