import { envVars } from "./dotenv";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["security"]>;

export const security = { csp: envVars.NODE_ENV === "production" } satisfies Config;
