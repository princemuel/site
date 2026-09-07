import { logHandlers as handlers } from "astro/config";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["logger"]>;

export const logger = handlers.console() satisfies Config;
