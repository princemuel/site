import type { AstroUserConfig } from "astro";
import { fontProviders } from "astro/config";

type Config = AstroUserConfig["fonts"];

// name: "Cantarell", // name: "Sen", // name: "Catamaran"
export const fonts = [
  {
    name: "Sen",
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
    subsets: ["latin"],
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
  {
    provider: fontProviders.fontsource(),
    name: "Zeyada",
    cssVariable: "--font-family-accent",
    subsets: ["latin"],
    fallbacks: [
      "Brush Script MT",
      "Segoe Script",
      "Bradley Hand",
      "Lucida Handwriting",
      "cursive",
    ],
  },
] satisfies Config;
