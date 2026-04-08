import { fontProviders } from "astro/config";

import type { AstroUserConfig } from "astro";

type Config = AstroUserConfig["fonts"];

export const fonts = [
  {
    name: "Geist",
    provider: fontProviders.fontsource(),
    cssVariable: "--font-family-sans",
    subsets: ["latin"],
    fallbacks: [
      "ui-sans-serif",
      "system-ui",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji",
    ],
    formats: ["woff2", "ttf"],
  },
  {
    name: "Geist Mono",
    provider: fontProviders.fontsource(),
    cssVariable: "--font-family-mono",
    fallbacks: [
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace",
    ],
  },
] satisfies Config;
