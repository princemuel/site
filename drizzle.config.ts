// import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "production";
const envVars = loadEnv(mode, process.cwd(), "");

export default defineConfig({
  schema: "./src/db/schema",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: envVars.DATABASE_URL!,
    authToken: envVars.DATABASE_TOKEN,
  },
});
