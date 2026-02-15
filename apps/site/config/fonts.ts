// SPDX-License-Identifier: Apache-2.0
import { fontProviders } from "astro/config";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["fonts"]>;

export const fonts = [
  {
    name: "Maven Pro",
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
    name: "Mono Lisa",
    provider: fontProviders.local(),
    cssVariable: "--font-family-mono",
    //@ts-expect-error -- types are missing here
    options: {
      variants: [
        { weight: "100 900", style: "normal", src: ["./src/assets/fonts/MonoLisa-normal.woff2"] },
        { weight: "100 900", style: "italic", src: ["./src/assets/fonts/MonoLisa-italic.woff2"] },
      ],
    },
    fallbacks: ["ui-monospace", "monospace"],
  },
] satisfies Config;
