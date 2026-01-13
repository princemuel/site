// SPDX-License-Identifier: Apache-2.0
import "@dotenvx/dotenvx/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/schema.prisma",
  typedSql: { path: "src/queries" },
  datasource: { url: env("LOCAL_DATABASE_URL") },
  migrations: {
    path: "src/migrations",
    seed: `node --import=tsx src/seed.ts`,
  },
});
