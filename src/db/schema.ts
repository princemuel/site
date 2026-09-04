import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

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

const mediums = [
  "book",
  "film",
  "short_film",
  "show",
  "podcast",
  "screenplay",
  "comic",
  "theater",
  "music",
  "game",
] as const;

export const genres = sqliteTable("genres", {
  id: integer().primaryKey(),
  name: text().notNull().unique(),
});

export const media_entries = sqliteTable(
  "media_entries",
  {
    id: text("id").primaryKey(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    status: text({ enum: ["finished", "paused", "planned"] })
      .notNull()
      .default("planned"),
    medium: text({ enum: mediums }).notNull(),
    cover_url: text().notNull(),
    cover_thumb: text(),
    created_at: timestamptz()
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
    updated_at: timestamptz().$onUpdate(() => sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  },
  (t) => [
    index("media_entries_medium_idx").on(t.medium),
    index("media_entries_status_idx").on(t.status),
  ],
);

export const media_entry_genres = sqliteTable(
  "media_entry_genres",
  {
    entry_id: text()
      .notNull()
      .references(() => media_entries.id, { onDelete: "cascade" }),
    genre_id: integer()
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.entry_id, t.genre_id] }),
    index("media_entry_genre_idx").on(t.genre_id),
  ],
);

export const films = sqliteTable("films", {
  id: text()
    .primaryKey()
    .references(() => media_entries.id, { onDelete: "cascade" }),
  external_id: text().notNull().unique(),
  runtime: integer({ mode: "timestamp_ms" }),
  companies: text({ mode: "json" }).$type<string[]>(),
});

export const shows = sqliteTable("shows", {
  id: text()
    .primaryKey()
    .references(() => media_entries.id, { onDelete: "cascade" }),
  external_id: text().notNull().unique(),
  payload_date: timestamptz(),
  seasons: integer().notNull().default(1),
  episodes: integer().notNull().default(1),
});

export const books = sqliteTable("books", {
  id: text()
    .primaryKey()
    .references(() => media_entries.id, { onDelete: "cascade" }),
  external_id: text().notNull().unique(),
  payload_date: timestamptz(),
  pages: integer().notNull(),
  authors: text({ mode: "json" }).$type<string[]>(),
});

export const comics = sqliteTable("comics", {
  id: text()
    .primaryKey()
    .references(() => media_entries.id, { onDelete: "cascade" }),
  external_id: text().notNull().unique(),
  payload_date: timestamptz(),
  issue_count: integer().notNull(),
  publisher: text(),
  illustrators: text({ mode: "json" }).$type<string[]>(),
});

export const games = sqliteTable("games", {
  id: text()
    .primaryKey()
    .references(() => media_entries.id, { onDelete: "cascade" }),
  external_id: text().notNull().unique(),
  payload_date: timestamptz(),
  platforms: text({ mode: "json" }).$type<string[]>(),
});

export const music = sqliteTable("music", {
  id: text()
    .primaryKey()
    .references(() => media_entries.id, { onDelete: "cascade" }),
  payload_date: timestamptz(),
  location: text(),
  artists: text("artists", { mode: "json" }).$type<string[]>(),
});

export const podcasts = sqliteTable("podcasts", {
  id: text()
    .primaryKey()
    .references(() => media_entries.id, { onDelete: "cascade" }),
  payload_date: timestamptz(),
  permalink: text(),
  network: text(),
  episodes: integer(),
});

export const theater = sqliteTable("theater", {
  id: text()
    .primaryKey()
    .references(() => media_entries.id, { onDelete: "cascade" }),
  payload_date: timestamptz(),
  location: text(),
  playwright: text(),
});

export const screenplays = sqliteTable("screenplays", {
  id: text()
    .primaryKey()
    .references(() => media_entries.id, { onDelete: "cascade" }),
  payload_date: timestamptz(),
  based_on: text().references((): AnySQLiteColumn => media_entries.id),
  authors: text("authors", { mode: "json" }).$type<string[]>(),
});

export const DETAILS_TABLE_BY_TYPE = {
  book: books,
  film: films,
  short_film: films,
  tv: shows,
  podcast: podcasts,
  screenplay: screenplays,
  comic: comics,
  theater,
  music,
  game: games,
} as const;
