import { fileURLToPath } from "node:url";

import Slugger from "github-slugger";

import type { HastPlugin } from "./types";

const slugs = new Map<string, Slugger>();

export const _HastAutolinkHeadings: HastPlugin = {
  name: "hast-autolink-headings",
  element: {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    visit(node, ctx) {
      const headingId = node.properties?.["id"];
      let id: string;
      const title = ctx.textContent(node);
      const filename = fileURLToPath(ctx.fileURL!);

      if (headingId && typeof headingId === "string") {
        id = headingId;
      } else {
        let slugger = slugs.getOrInsertComputed(filename, () => new Slugger());
        id = slugger.slug(title);
        ctx.setProperty(node, "id", id);
      }

      return {
        type: "element",
        tagName: "div",
        properties: { class: `sl-heading-wrapper level-${node.tagName}` },
        children: [
          node,
          {
            type: "element",
            tagName: "a",
            properties: { class: "sl-anchor-link", href: `#${id}` },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { "aria-hidden": "true", class: "sl-anchor-icon" },
                children: [
                  {
                    type: "element",
                    tagName: "svg",
                    properties: { width: "1em", height: "1em", viewBox: "0 0 24 24" },
                    children: [
                      {
                        type: "element",
                        tagName: "path",
                        properties: {
                          fill: "currentcolor",
                          d: "m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z",
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: "element",
                tagName: "span",
                properties: { class: "sr-only", "data-pagefind-ignore": true },
                children: [{ type: "text", value: `Permalink to ${title}` }],
              },
            ],
          },
        ],
      };
    },
  },
};
