import { sql } from "drizzle-orm";
import {
  type AnySQLiteColumn,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { timestamptz } from "@/db/helpers";

import { actors } from "./actors";
import { posts } from "./posts";

export const comments = sqliteTable(
  "comments",
  {
    id: integer().primaryKey(),
    content: text().notNull(),
    post_id: integer()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    actor_id: integer()
      .notNull()
      .references(() => actors.id, { onDelete: "cascade" }),
    parent_id: integer().references((): AnySQLiteColumn => comments.id, {
      onDelete: "cascade",
    }),
    created_at: timestamptz()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
      .notNull(),
    updated_at: timestamptz().$onUpdate(() => sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  },
  (table) => [
    index("comments_post_id_created_at_idx").on(table.post_id, table.created_at),
    index("comments_actor_id_idx").on(table.actor_id),
    index("comments_parent_id_created_at_idx").on(table.parent_id, table.created_at),
  ],
);
