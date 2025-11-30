// SPDX-License-Identifier: Apache-2.0
import "@dotenvx/dotenvx/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/client";

const client = globalThis as typeof globalThis & { db?: PrismaClient };
const adapter = new PrismaLibSql({
  url: `${process.env.DATABASE_URL}`,
  authToken: `${process.env.DATABASE_TOKEN}`,
});

export const db = client.db ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") client.db = db;
