// oxlint-disable typescript/no-unsafe-assignment
// const db = new DatabaseSync("content.db");
// db.exec("PRAGMA journal_mode = WAL");
// db.exec("PRAGMA synchronous = NORMAL");
// db.exec("PRAGMA busy_timeout = 5000");

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: import.meta.env.DATABASE_URL!,
  authToken: import.meta.env.DATABASE_TOKEN,
});

export const db = drizzle({ client });
