// https://astro.build/db/config
import { column, defineDb, defineTable, NOW } from "astro:db";

const Author = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
  },
});

const Comment = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    authorId: column.text({ references: () => Author.columns.id }),
    content: column.text({ optional: true }),
    publishedAt: column.date({ default: NOW }),
  },
  indexes: [{ on: ["authorId", "publishedAt"] }],
});

export default defineDb({
  tables: { Author, Comment },
});
