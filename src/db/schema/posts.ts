import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamptz } from "@/db/helpers";

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    created_at: timestamptz()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
      .notNull(),
    updated_at: timestamptz().$onUpdate(() => Temporal.Now.instant()),
  },
  (table) => [index("post_created_at_idx").on(table.created_at)],
);
