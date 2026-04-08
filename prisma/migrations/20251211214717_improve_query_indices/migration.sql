-- DropIndex
DROP INDEX "comments_post_id_created_at_idx";

-- DropIndex
DROP INDEX "posts_created_at_idx";

-- AlterTable
ALTER TABLE "actors" ADD COLUMN "name" TEXT;

-- CreateIndex
CREATE INDEX "comments_post_id_created_at_idx" ON "comments"("post_id", "created_at");

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");
