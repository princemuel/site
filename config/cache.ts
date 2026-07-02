import type { AstroUserConfig } from "astro";
import { memoryCache } from "astro/config";

type Config = NonNullable<AstroUserConfig["cache"]>;

export const cache = { provider: memoryCache() } satisfies Config;
