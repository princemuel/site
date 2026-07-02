//@ts-check
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { defineEcConfig } from "astro-expressive-code";
import twDefaultTheme from "tailwindcss/defaultTheme";

const fonts = Object.fromEntries(
  Object.entries(twDefaultTheme.fontFamily).map(([key, value]) => [
    key,
    [`var(--font-family-${key})`, ...value].join(","),
  ]),
);

export default defineEcConfig({
  themes: ["vitesse-dark", "vitesse-light"],
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
  cascadeLayer: "shiki",
  emitExternalStylesheet: true,
  themeCssSelector: (theme) => `[data-code-theme='${theme.name}']`,
  styleOverrides: { codeFontFamily: fonts.mono, uiFontFamily: fonts.sans },
});
