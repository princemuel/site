/*
  Warnings:

  - You are about to drop the `page_views` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `created_at` on the `actors` table. All the data in the column will be lost.
  - You are about to drop the column `actor_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `posts` table. All the data in the column will be lost.
  - Added the required column `actorId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "page_views_path_created_at_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "page_views";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "referrer" TEXT,
    "country" TEXT,
    "city" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "flag" TEXT
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "reaction" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_actors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "handle" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_actors" ("handle", "id", "image", "name") SELECT "handle", "id", "image", "name" FROM "actors";
DROP TABLE "actors";
ALTER TABLE "new_actors" RENAME TO "actors";
CREATE UNIQUE INDEX "actors_handle_key" ON "actors"("handle");
CREATE TABLE "new_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "postId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "actors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("content", "id") SELECT "content", "id" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
CREATE INDEX "comments_postId_createdAt_idx" ON "comments"("postId", "createdAt");
CREATE INDEX "comments_actorId_idx" ON "comments"("actorId");
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "reactions" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_posts" ("id", "impressions", "reactions", "slug", "title") SELECT "id", "impressions", "reactions", "slug", "title" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "analytics_path_idx" ON "analytics"("path");

-- CreateIndex
CREATE INDEX "analytics_occurredAt_idx" ON "analytics"("occurredAt");

-- CreateIndex
CREATE INDEX "reactions_slug_idx" ON "reactions"("slug");

-- CreateIndex
CREATE INDEX "reactions_reaction_idx" ON "reactions"("reaction");

-- CreateIndex
CREATE INDEX "reactions_occurredAt_idx" ON "reactions"("occurredAt");
