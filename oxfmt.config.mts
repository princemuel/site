import { defineConfig } from "oxfmt";

export default defineConfig({
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  printWidth: 96,
  trailingComma: "all",
  jsdoc: true,
  attributeGroups: ["^class$", "^(id|name)$", "$DEFAULT", "^aria-"],
  sortImports: true,
  sortTailwindcss: {
    stylesheet: "./src/global.css",
    functions: ["clsx", "cn", "cva", "tw", "tv"],
    attributes: ["tw"],
  },
  sortPackageJson: { sortScripts: true },
  ignorePatterns: ["target", ".yarn", "index.js", "*.geojson", "*.rs"],
});
