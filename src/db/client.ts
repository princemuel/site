import { DATABASE_TOKEN, DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/tursodatabase-sync";

export const db = drizzle({
  connection: {
    path: "local.db",
    url: DATABASE_URL,
    authToken: DATABASE_TOKEN,
    clientName: "shaharah",
  },
});
