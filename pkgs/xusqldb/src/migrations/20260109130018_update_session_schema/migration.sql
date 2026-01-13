/*
  Warnings:

  - You are about to drop the column `referrer` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `session` table. All the data in the column will be lost.
  - Added the required column `page_url` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "session_start" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_end" DATETIME,
    "page_url" TEXT NOT NULL,
    "source_url" TEXT,
    "title" TEXT,
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
INSERT INTO "new_session" ("city", "country", "created_at", "duration_human", "duration_ms", "flag", "id", "interactions", "latitude", "longitude", "session_end", "session_start", "title", "updated_at", "user_agent") SELECT "city", "country", "created_at", "duration_human", "duration_ms", "flag", "id", "interactions", "latitude", "longitude", "session_end", "session_start", "title", "updated_at", "user_agent" FROM "session";
DROP TABLE "session";
ALTER TABLE "new_session" RENAME TO "session";
CREATE INDEX "session_page_url_idx" ON "session"("page_url");
CREATE INDEX "session_session_start_idx" ON "session"("session_start");
CREATE INDEX "session_page_url_session_start_idx" ON "session"("page_url", "session_start");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
