// SPDX-License-Identifier: Apache-2.0
import "@dotenvx/dotenvx/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";

import { PrismaClient } from "./prisma/client";

var g = globalThis as typeof globalThis & { __db__?: PrismaClient };
var adapter = new PrismaLibSql({
  url: `${process.env.DATABASE_URL}`,
  authToken: `${process.env.DATABASE_TOKEN}`,
});
export var db = g.__db__ ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") g.__db__ = db;
process.on("beforeExit", () => void db.$disconnect());
