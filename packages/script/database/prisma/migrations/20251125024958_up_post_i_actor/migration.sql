/*
  Warnings:

  - You are about to drop the column `username` on the `Actor` table. All the data in the column will be lost.
  - Added the required column `handle` to the `Actor` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Actor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "handle" TEXT NOT NULL,
    "image" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Actor" ("created_at", "id") SELECT "created_at", "id" FROM "Actor";
DROP TABLE "Actor";
ALTER TABLE "new_Actor" RENAME TO "Actor";
CREATE UNIQUE INDEX "Actor_handle_key" ON "Actor"("handle");
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "reactions" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_posts" ("created_at", "id", "slug", "title", "updated_at") SELECT "created_at", "id", "slug", "title", "updated_at" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
