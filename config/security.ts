// SPDX-License-Identifier: Apache-2.0

import type { AstroUserConfig } from "astro";
import { envVars } from "./dotenv";

type Config = NonNullable<AstroUserConfig["security"]>;

export const security = { csp: envVars.NODE_ENV === "production" } satisfies Config;
