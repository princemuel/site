import type { MdastPluginDefinition } from "satteri";

export function MdastDeruntify(): MdastPluginDefinition {
  return {
    name: "mdast-derutify",
    text(node, ctx) {
      const wordCount = node.value.split(" ").length;
      if (wordCount < 5) {
        ctx.setProperty(node, "value", node.value.replace(/ ([^ ]*)$/, "\u00A0$1"));
      }
    },
  };
}
