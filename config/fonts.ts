import { fontProviders } from "astro/config";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<NonNullable<AstroUserConfig["experimental"]>["fonts"]>;

export const fonts = [
  {
    provider: "local",
    name: "FontFamilySans",
    cssVariable: "--font-family-sans",
    variants: [
      {
        weight: 400,
        style: "normal",
        src: ["./fonts/custom-400.woff2"],
      },
      {
        weight: 500,
        style: "normal",
        src: ["./fonts/custom-500.woff2"],
      },

      {
        weight: 600,
        style: "normal",
        src: ["./fonts/custom-600.woff2"],
      },
    ],
    fallbacks: [
      "ui-sans-serif",
      "system-ui",
      "apple-system",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji",
    ],
  },
  {
    name: "JetBrains Mono",
    // name: "Source Code Pro",
    provider: fontProviders.google(),
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
] satisfies Config;
