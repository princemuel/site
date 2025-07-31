import { fontProviders } from "astro/config";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<NonNullable<AstroUserConfig["experimental"]>["fonts"]>;

export const fonts = [
  {
    // name: "Sen",
    name: "Cantarell",
    provider: fontProviders.google(),
    cssVariable: "--font-family-sans",
    subsets: ["latin"],
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
      "'Liberation Mono'",
      "'Courier New'",
      "monospace",
    ],
  },
] satisfies Config;
