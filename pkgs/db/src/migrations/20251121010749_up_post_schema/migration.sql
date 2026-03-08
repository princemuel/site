/*
  Warnings:

  - You are about to drop the column `published` on the `posts` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_posts" ("created_at", "id", "slug", "title", "updated_at") SELECT "created_at", "id", "slug", "title", "updated_at" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
