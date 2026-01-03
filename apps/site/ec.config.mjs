//@ts-check
import { defineEcConfig } from "astro-expressive-code";

import twDefaultTheme from "tailwindcss/defaultTheme";

import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";

const fonts = Object.fromEntries(
  Object.entries(twDefaultTheme.fontFamily).map(([key, value]) => [
    key,
    [`var(--font-family-${key})`, ...value].join(),
  ]),
);

export default defineEcConfig({
  themes: ["gruvbox-dark-hard", "gruvbox-light-hard"],
  plugins: [pluginCollapsibleSections()],
  cascadeLayer: "shiki",
  emitExternalStylesheet: true,
  themeCssSelector: (theme) => `[data-code-theme='${theme.name}']`,
  styleOverrides: { codeFontFamily: fonts.mono, uiFontFamily: fonts.sans },
});
