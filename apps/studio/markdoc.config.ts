import { component, defineMarkdocConfig, nodes } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  nodes: {
    // fence: {
    //   render: component("./src/components/content/code.astro"),
    //   attributes: {
    //     content: { type: String, required: true },
    //     language: { type: String },
    //     title: { type: String },
    //     frame: { type: String, matches: ["none", "auto", "code", "terminal"] },
    //   },

    // },
    fence: {
      attributes: { ...nodes.fence.attributes, title: { type: String, render: "title" } },
      render: component("./src/components/content/code.astro"),
    },
  },
});
