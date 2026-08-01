import getReadingTime from "reading-time";
import type { MdastPluginDefinition } from "satteri";

export const mdast_reading_time = (): MdastPluginDefinition => {
  let text = "";

  return {
    name: "mdast-reading-time",
    text(node, ctx) {
      const frontmatter = ctx.data.astro?.frontmatter;
      if (!frontmatter) return;

      text += `${node.value} `;
      const { words, minutes } = getReadingTime(text);
      frontmatter.words = words;
      frontmatter.duration = minutes;
    },
  };
};
