import getReadingTime from "reading-time";

import type { MdastPluginDefinition } from "./types.ts";

export const mdast_reading_time: MdastPluginDefinition = {
  name: "mdast-reading-time",
  after(root, ctx) {
    if (!ctx.data.astro) return;
    const textOnPage = ctx.textContent(root);
    const { words, minutes } = getReadingTime(textOnPage);
    ctx.data.astro.frontmatter.words = words;
    ctx.data.astro.frontmatter.duration = minutes;
  },
};
