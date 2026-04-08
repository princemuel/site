import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["prefetch"]>;

export const prefetch = {
  defaultStrategy: "hover",
  prefetchAll: false,
} satisfies Config;
