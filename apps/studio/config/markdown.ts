// SPDX-License-Identifier: Apache-2.0
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import * as mdAstUtilToString from "mdast-util-to-string";
import getReadingTime from "reading-time";
// import { toString as hastUtilToString } from "hast-util-to-string";
// import { h } from "hastscript";
// import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import remarkCollapse from "remark-collapse";
import remarkEmoji from "remark-emoji";
import remarkToc from "remark-toc";

import { visit } from "unist-util-visit";

import { getFileModifiedTime } from "./helpers";

import type { AstroUserConfig } from "astro";
type Config = NonNullable<NonNullable<AstroUserConfig["markdown"]>>;
type RemarkPlugin = NonNullable<Config["remarkPlugins"]>[number];

const { toString: parseToString } = mdAstUtilToString;

const remarkReadingTime: RemarkPlugin = () => {
  return (tree, file) => {
    if (file.data.astro?.frontmatter) {
      const textOnPage = parseToString(tree);
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
  if (file.data?.astro?.frontmatter) {
    const frontmatter = file.data.astro.frontmatter;
    // Skip files without publishedAt
    if (!frontmatter.publishedAt || !file.history?.[0]) return;

    try {
      const gitModified = getFileModifiedTime(file.history[0]);
      const published = Temporal.Instant.from(frontmatter.publishedAt);
      const daysSincePublish = gitModified.since(published).total("days");

      // Get the latest revision date if revisions exist
      const latestRevisionDate = frontmatter.revisions?.length
        ? Temporal.Instant.from(frontmatter.revisions[frontmatter.revisions.length - 1].date)
        : null;

      // Only auto-set updatedAt if:
      // 1. No manual updatedAt already set
      // 2. More than 1 day since publish
      // 3. Git shows changes newer than latest revision (or no revisions exist)
      const shouldSetUpdatedAt =
        !frontmatter.updatedAt &&
        daysSincePublish > 1 &&
        (!latestRevisionDate || Temporal.Instant.compare(gitModified, latestRevisionDate) > 0);

      if (shouldSetUpdatedAt) frontmatter.updatedAt = gitModified.toString();
    } catch {
      return;
    }
  }
};

export const markdown = {
  gfm: true,
  smartypants: true,
  remarkPlugins: [
    remarkToc,
    [remarkCollapse, { test: "Table of contents" }],
    remarkDeruntify,
    remarkReadingTime,
    remarkModifiedTime,
    [remarkEmoji, { accessible: true, padSpaceAfter: true, emoticon: true }],
  ],
  rehypePlugins: [
    rehypeHeadingIds,
    [
      rehypeExternalLinks,
      { rel: ["nofollow", "noopener", "noreferrer", "external"], target: "_blank" },
    ],
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
