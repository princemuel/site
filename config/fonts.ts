import type { AstroUserConfig } from "astro";
import { fontProviders } from "astro/config";

type Config = AstroUserConfig["fonts"];

// name: "Cantarell", // name: "Sen",
export const fonts = [
  {
    name: "Catamaran",
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
    name: "JetBrains Mono",
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
