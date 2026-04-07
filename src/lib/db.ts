// SPDX-License-Identifier: Apache-2.0
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL, getSecret } from "astro:env/server";

import { PrismaClient } from "./prisma/client";

var g = globalThis as typeof globalThis & { __db__?: PrismaClient };
var adapter = new PrismaPg({ connectionString: DATABASE_URL });

export var db = g.__db__ ?? new PrismaClient({ adapter });

if (getSecret("NODE_ENV") !== "production") g.__db__ = db;
console.log("PROCESS", JSON.stringify(process));
process.on("beforeExit", () => void db.$disconnect());
