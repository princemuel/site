// SPDX-License-Identifier: Apache-2.0
import { fontProviders } from "astro/config";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<NonNullable<AstroUserConfig["experimental"]>["fonts"]>;

export const fonts = [
  {
    name: "Maven Pro",
    provider: fontProviders.fontsource(),
    cssVariable: "--font-family-sans",
    subsets: ["latin"],
    fallbacks: [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Open Sans",
      "Helvetica Neue",
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
    provider: "local",
    cssVariable: "--font-family-mono",
    variants: [
      { style: "normal", src: ["./app/assets/fonts/MonoLisa-normal.woff2"] },
      { style: "italic", src: ["./app/assets/fonts/MonoLisa-italic.woff2"] },
    ],
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
