import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { temporalInstant } from "@/db/helpers";

export const ratelimits = sqliteTable("ratelimits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  reset_at: temporalInstant("reset_at").notNull(),
});
