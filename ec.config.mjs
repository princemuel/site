//@ts-check
import { defineEcConfig } from "astro-expressive-code";

import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginCodeOutput } from "@fujocoded/expressive-code-output";
import { pluginFullscreen } from "expressive-code-fullscreen";

import twDefaultTheme from "tailwindcss/defaultTheme.js";

const fonts = {
  mono: ["var(--font-family-mono)", ...twDefaultTheme.fontFamily.mono].join(","),
  sans: ["var(--font-family-sans)", ...twDefaultTheme.fontFamily.sans].join(","),
};

export default defineEcConfig({
  themes: ["github-dark-default", "github-light-default"],
  plugins: [pluginCodeOutput(), pluginFullscreen(), pluginCollapsibleSections()],
  cascadeLayer: "shiki",
  emitExternalStylesheet: true,
  themeCssSelector: (theme) => `[data-code-theme='${theme.name}']`,
  styleOverrides: { codeFontFamily: fonts.mono, uiFontFamily: fonts.sans },
});
