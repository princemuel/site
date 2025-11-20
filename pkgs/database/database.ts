import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./src/client";

const adapter = new PrismaLibSql({
  url: `${process.env.DATABASE_URL}`,
  authToken: `${process.env.DATABASE_TOKEN}`,
});

// Use globalThis for broader environment compatibility
const globalForPrisma = globalThis as typeof globalThis & { db?: PrismaClient };

// Named export with global memoization
export const db = globalForPrisma.db ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;
