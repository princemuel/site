import getReadingTime from "reading-time";
import type { MdastPluginDefinition } from "satteri";

console.log("[MdastReadingTime] plugin loaded");

export function MdastReadingTime(): MdastPluginDefinition {
  return {
    name: "mdast-reading-time",
    text(node, ctx) {
      if (ctx.data.astro?.frontmatter) {
        const readingTime = getReadingTime(node.value);

        if (!ctx.data.astro.frontmatter.words) ctx.data.astro.frontmatter.words = readingTime.words;
        else ctx.data.astro.frontmatter.words += readingTime.words;

        if (!ctx.data.astro.frontmatter.duration)
          ctx.data.astro.frontmatter.duration = readingTime.minutes;
        else ctx.data.astro.frontmatter.duration += readingTime.minutes;
      }
    },
  };
}

// Const remarkReadingTime: RemarkPlugin = () => (tree, file) => {
//   If (file.data.astro?.frontmatter) {
//     Const textOnPage = toString(tree);
//     Const readingTime = getReadingTime(textOnPage);
//     File.data.astro.frontmatter.words = readingTime.words;
//     File.data.astro.frontmatter.duration = readingTime.text;
//   }
// };
