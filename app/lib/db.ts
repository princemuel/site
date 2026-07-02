import { DatabaseSync } from "node:sqlite";

const cdb = new DatabaseSync("content.db");
const edb = new DatabaseSync("events.db");
