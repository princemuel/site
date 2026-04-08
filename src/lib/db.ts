// SPDX-License-Identifier: Apache-2.0
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { DATABASE_ENCRYPTION, DATABASE_TOKEN, DATABASE_URL, getSecret } from "astro:env/server";

import { PrismaClient } from "./prisma/client";

var adapter = new PrismaLibSql({
  url: DATABASE_URL,
  authToken: DATABASE_TOKEN,
  encryptionKey: DATABASE_ENCRYPTION,
});
var DatabaseClient = new PrismaClient({ adapter });
var g = globalThis as typeof globalThis & { __db__?: typeof DatabaseClient };

export var db = g.__db__ ?? DatabaseClient;

if (getSecret("NODE_ENV") !== "production") g.__db__ = db;
process.on("beforeExit", () => void db.$disconnect());
