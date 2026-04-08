import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["image"]>;

export const images = {
  layout: "constrained",
} satisfies Config;
