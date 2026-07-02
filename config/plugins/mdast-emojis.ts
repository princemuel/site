import { emojify } from "node-emoji"; // or your own map: { wave: "👋", fire: "🔥", ... }

import type { MdastPlugin } from "./types";

export const MdastEmojis = (options: { padSpaceAfter?: boolean } = {}): MdastPlugin => {
  const { accessible = false, padSpaceAfter = false } = options;

  return {
    name: "mdast-emojis",
    text(node, ctx) {
      if (!node.value.includes(":")) return; // cheap bail-out, no regex needed
      const replaced = emojify(node.value, {
        fallback: (shortcode) => shortcode,
        format: padSpaceAfter ? (emoji) => `${emoji} ` : undefined,
      });

      if (replaced !== node.value) ctx.setProperty(node, "value", replaced);
    },
  };
};
