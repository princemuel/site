import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, type AnySQLiteColumn } from "drizzle-orm/sqlite-core";

import { timestamptz } from "@/db/helpers";

export const actors = sqliteTable("actors", {
  id: integer().primaryKey(),
  name: text(),
  handle: text().notNull().unique(),
  image: text(),
  created_at: timestamptz()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull(),
});
export const posts = sqliteTable(
  "posts",
  {
    id: integer().primaryKey(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    created_at: timestamptz()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
      .notNull(),
    updated_at: timestamptz().$onUpdate(() => sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  },
  (t) => [index("post_created_at_idx").on(t.created_at)],
);

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
  (t) => [
    index("comments_post_id_created_at_idx").on(t.post_id, t.created_at),
    index("comments_actor_id_idx").on(t.actor_id),
    index("comments_parent_id_created_at_idx").on(t.parent_id, t.created_at),
  ],
);
