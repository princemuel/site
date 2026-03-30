// SPDX-License-Identifier: Apache-2.0
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";
// import { toString as hastUtilToString } from "hast-util-to-string";
// import { h } from "hastscript";
// import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkEmoji from "remark-emoji";
import remarkToc from "remark-toc";

import { visit } from "unist-util-visit";

import { getFileModifiedTime } from "./helpers";

import type { AstroUserConfig } from "astro";
type Config = NonNullable<AstroUserConfig["markdown"]>;
type RemarkPlugin = NonNullable<Config["remarkPlugins"]>[number];

const remarkReadingTime: RemarkPlugin = () => {
  return (tree, file) => {
    if (file.data.astro?.frontmatter) {
      const textOnPage = toString(tree);
      const readingTime = getReadingTime(textOnPage);
      file.data.astro.frontmatter.words = readingTime.words;
      file.data.astro.frontmatter.duration = readingTime.text;
    }
  };
};

const remarkDeruntify: RemarkPlugin = () => (tree) => {
  visit(tree, "text", (node) => {
    const wordCount = node.value.split(" ").length;
    if (wordCount <= 4) node.value = node.value.replace(/ ([^ ]*)$/, "\u00A0$1");
  });
};

const remarkModifiedTime: RemarkPlugin = () => (_, file) => {
  if (!file.data?.astro?.frontmatter) return;

  const frontmatter = file.data.astro.frontmatter;
  // Skip files without date
  if (!frontmatter.date || !file.history?.[0]) return;

  try {
    const timeModified = getFileModifiedTime(file.history[0]).toZonedDateTimeISO("UTC");
    const published = Temporal.Instant.from(frontmatter.date).toZonedDateTimeISO("UTC");
    const daysSincePublished = timeModified.since(published).total("days");

    // Get the latest revision date if revisions exist
    const latestRevisionDate = frontmatter.revisions?.length
      ? Temporal.Instant.from(
          frontmatter.revisions[frontmatter.revisions.length - 1].date,
        ).toZonedDateTimeISO("UTC")
      : null;

    // Only auto-set updated if:
    // 1. No manual updated already set
    // 2. More than 1 day since publish
    // 3. Git shows changes newer than latest revision (or no revisions exist)
    const shouldSetUpdatedAt =
      !frontmatter.updated &&
      Math.abs(daysSincePublished) > 1 &&
      (!latestRevisionDate || Temporal.ZonedDateTime.compare(timeModified, latestRevisionDate) > 0);

    if (shouldSetUpdatedAt) frontmatter.updated = timeModified.toInstant().toString();
  } catch {}
};

export const markdown = {
  gfm: true,
  smartypants: true,
  remarkPlugins: [
    remarkToc,
    remarkDeruntify,
    remarkReadingTime,
    remarkModifiedTime,
    [remarkEmoji, { accessible: true, padSpaceAfter: true, emoticon: true }],
  ],
  rehypePlugins: [
    rehypeHeadingIds,
    // [
    //   rehypeAutolinkHeadings,
    //   {
    //     behavior: "after",
    //     content: (node: any) => [
    //       h("span", { ariaHidden: "true" }, "#"),
    //       h("span.anchor-hidden", "Section titled “", hastUtilToString(node), "”"),
    //     ],
    //     group: () => h(".anchor"),
    //   },
    // ],
    // [rehypeAutolinkHeadings, { behavior: "after", content: (node) => h("#") }],
  ],
} satisfies Config;
