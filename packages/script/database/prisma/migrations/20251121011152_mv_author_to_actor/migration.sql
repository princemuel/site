/*
  Warnings:

  - You are about to drop the `CommentAuthor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `author_id` on the `comments` table. All the data in the column will be lost.
  - Added the required column `actor_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CommentAuthor_username_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CommentAuthor";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Actor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "post_id" INTEGER NOT NULL,
    "actor_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("content", "created_at", "id", "parent_id", "post_id", "updated_at") SELECT "content", "created_at", "id", "parent_id", "post_id", "updated_at" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
CREATE INDEX "comments_post_id_parent_id_idx" ON "comments"("post_id", "parent_id");
CREATE INDEX "comments_parent_id_idx" ON "comments"("parent_id");
CREATE INDEX "comments_created_at_idx" ON "comments"("created_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Actor_username_key" ON "Actor"("username");
