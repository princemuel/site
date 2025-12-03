// SPDX-License-Identifier: Apache-2.0
import { defineConfig, env } from "prisma/config";

// import the .env file
import "@dotenvx/dotenvx/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: env("DATABASE_URL") },
  migrations: {
    path: "prisma/migrations",
    // seed: `node --import=tsx prisma/seed.ts`,
  },
});
