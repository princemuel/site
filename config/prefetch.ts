import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["prefetch"]>;

export const prefetch = true satisfies Config;
