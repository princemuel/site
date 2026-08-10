import { timestamptz } from "@/db/helpers";
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    handle: text().notNull().unique(),
    image: text(),
    created_at: timestamptz()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
      .notNull(),
    updated_at: timestamptz(),
  },
  (table) => [index("post_created_at_idx").on(table.created_at)],
);
