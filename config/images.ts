import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["image"]>;

export const images = {
  layout: "constrained",
  responsiveStyles: true,
  domains: [
    "avatars.githubusercontent.com",
    "maps.googleapis.com",
    "places.googleapis.com",
    "lh3.googleusercontent.com",
    "covers.openlibrary.org",
    "m.media-amazon.com",
  ],
  service: {
    entrypoint: "astro/assets/services/sharp",
    config: {
      avif: { quality: 75, effort: 5, chromaSubsampling: "4:4:4" },
      webp: {
        quality: 75,
        alphaQuality: 75,
        effort: 5,
        smartSubsample: true,
        smartDeblock: true,
        minSize: true,
        mixed: true,
      },
      jpeg: { mozjpeg: true, progressive: true, quality: 75 },
      png: {
        progressive: true,
        quality: 75,
        effort: 10,
        compressionLevel: 8,
        adaptiveFiltering: true,
        palette: true,
      },
    },
  },
} satisfies Config;
