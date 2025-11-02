//@ts-check
import { defineEcConfig } from "astro-expressive-code";

import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
// import { pluginCodeOutput } from "@fujocoded/expressive-code-output";
import { pluginFullscreen } from "expressive-code-fullscreen";

import twDefaultTheme from "tailwindcss/defaultTheme";

const fonts = Object.fromEntries(
  Object.entries(twDefaultTheme.fontFamily).map(([key, value]) => [
    key,
    [`var(--font-family-${key})`, ...value].join(),
  ]),
);

export default defineEcConfig({
  themes: ["github-dark-default", "github-light-default"],
  plugins: [pluginFullscreen(), pluginCollapsibleSections()],
  cascadeLayer: "shiki",
  emitExternalStylesheet: true,
  themeCssSelector: (theme) => `[data-code-theme='${theme.name}']`,
  styleOverrides: { codeFontFamily: fonts.mono, uiFontFamily: fonts.sans },
});
