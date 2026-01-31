import { sequence } from "astro:middleware";

import { botcheck } from "./botcheck";
import { secure_headers } from "./security";
// import { status } from "./status";

export const onRequest = sequence(secure_headers, botcheck);
