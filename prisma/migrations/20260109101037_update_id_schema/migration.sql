/*
  Warnings:

  - The primary key for the `actors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_actors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "handle" TEXT NOT NULL,
    "image" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_actors" ("created_at", "handle", "id", "image", "name") SELECT "created_at", "handle", "id", "image", "name" FROM "actors";
DROP TABLE "actors";
ALTER TABLE "new_actors" RENAME TO "actors";
CREATE UNIQUE INDEX "actors_handle_key" ON "actors"("handle");
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "post_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "parent_id" TEXT,
    CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("actor_id", "content", "created_at", "id", "parent_id", "post_id", "updated_at") SELECT "actor_id", "content", "created_at", "id", "parent_id", "post_id", "updated_at" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
CREATE INDEX "comments_post_id_created_at_idx" ON "comments"("post_id", "created_at");
CREATE INDEX "comments_actor_id_idx" ON "comments"("actor_id");
CREATE INDEX "comments_parent_id_idx" ON "comments"("parent_id");
CREATE TABLE "new_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "reactions" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_posts" ("created_at", "id", "impressions", "reactions", "slug", "title", "updated_at") SELECT "created_at", "id", "impressions", "reactions", "slug", "title", "updated_at" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
