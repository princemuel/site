import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["security"]>;

export const security = { csp: false } satisfies Config;
