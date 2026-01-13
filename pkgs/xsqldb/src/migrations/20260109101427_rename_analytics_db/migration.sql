/*
  Warnings:

  - You are about to drop the `analytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "analytics_url_session_start_idx";

-- DropIndex
DROP INDEX "analytics_session_start_idx";

-- DropIndex
DROP INDEX "analytics_url_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "analytics";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "session" (
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "metadata" TEXT,
    "session_id" TEXT NOT NULL,
    CONSTRAINT "events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_events" ("event", "id", "metadata", "session_id", "slug", "timestamp") SELECT "event", "id", "metadata", "session_id", "slug", "timestamp" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE INDEX "events_slug_idx" ON "events"("slug");
CREATE INDEX "events_event_idx" ON "events"("event");
CREATE INDEX "events_timestamp_idx" ON "events"("timestamp");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "session_url_idx" ON "session"("url");

-- CreateIndex
CREATE INDEX "session_session_start_idx" ON "session"("session_start");

-- CreateIndex
CREATE INDEX "session_url_session_start_idx" ON "session"("url", "session_start");
