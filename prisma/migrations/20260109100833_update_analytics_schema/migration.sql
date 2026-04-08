/*
  Warnings:

  - You are about to drop the column `createdAt` on the `actors` table. All the data in the column will be lost.
  - You are about to drop the column `occurredAt` on the `analytics` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `analytics` table. All the data in the column will be lost.
  - You are about to drop the column `actorId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `occurredAt` on the `reactions` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actor_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "metadata" TEXT,
    "session_id" TEXT NOT NULL,
    CONSTRAINT "events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "analytics" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_actors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "handle" TEXT NOT NULL,
    "image" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_actors" ("handle", "id", "image", "name") SELECT "handle", "id", "image", "name" FROM "actors";
DROP TABLE "actors";
ALTER TABLE "new_actors" RENAME TO "actors";
CREATE UNIQUE INDEX "actors_handle_key" ON "actors"("handle");
CREATE TABLE "new_analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "session_start" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_end" DATETIME,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "flag" TEXT,
    "duration_ms" INTEGER,
    "duration_human" TEXT,
    "interactions" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_analytics" ("city", "country", "flag", "id", "latitude", "longitude", "referrer", "title") SELECT "city", "country", "flag", "id", "latitude", "longitude", "referrer", "title" FROM "analytics";
DROP TABLE "analytics";
ALTER TABLE "new_analytics" RENAME TO "analytics";
CREATE INDEX "analytics_url_idx" ON "analytics"("url");
CREATE INDEX "analytics_session_start_idx" ON "analytics"("session_start");
CREATE INDEX "analytics_url_session_start_idx" ON "analytics"("url", "session_start");
CREATE TABLE "new_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "post_id" INTEGER NOT NULL,
    "actor_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("content", "id") SELECT "content", "id" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
CREATE INDEX "comments_post_id_created_at_idx" ON "comments"("post_id", "created_at");
CREATE INDEX "comments_actor_id_idx" ON "comments"("actor_id");
CREATE INDEX "comments_parent_id_idx" ON "comments"("parent_id");
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "reactions" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_posts" ("id", "impressions", "reactions", "slug", "title") SELECT "id", "impressions", "reactions", "slug", "title" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");
CREATE TABLE "new_reactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurred_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "reaction" TEXT NOT NULL
);
INSERT INTO "new_reactions" ("id", "reaction", "slug") SELECT "id", "reaction", "slug" FROM "reactions";
DROP TABLE "reactions";
ALTER TABLE "new_reactions" RENAME TO "reactions";
CREATE INDEX "reactions_slug_idx" ON "reactions"("slug");
CREATE INDEX "reactions_reaction_idx" ON "reactions"("reaction");
CREATE INDEX "reactions_occurred_at_idx" ON "reactions"("occurred_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_event_idx" ON "events"("event");

-- CreateIndex
CREATE INDEX "events_timestamp_idx" ON "events"("timestamp");
