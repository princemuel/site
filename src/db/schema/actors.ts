import { timestamptz } from "@/db/helpers";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const actors = sqliteTable("actors", {
  id: integer("id").primaryKey(),
  name: text(),
  handle: text().notNull().unique(),
  image: text(),
  created_at: timestamptz()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull(),
});
