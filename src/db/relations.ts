import { defineRelations } from "drizzle-orm";

import * as schema from "./schema.ts";

export const relations = defineRelations({ ...schema }, (r) => ({
  comments: {
    post: r.one.posts({ from: r.comments.post_id, to: r.posts.id }),
    actor: r.one.actors({ from: r.comments.actor_id, to: r.actors.id }),
    parent: r.one.comments({
      alias: "replies",
      from: r.comments.parent_id,
      to: r.comments.id,
    }),
    replies: r.many.comments({ alias: "replies" }),
  },
}));
