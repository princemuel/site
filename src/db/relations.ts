import { defineRelations } from "drizzle-orm";

import * as schema from "./schema.ts";

export const relations = defineRelations({ ...schema }, (rxn) => ({
  comments: {
    post: rxn.one.posts({ from: rxn.comments.post_id, to: rxn.posts.id }),
    actor: rxn.one.actors({ from: rxn.comments.actor_id, to: rxn.actors.id }),
    parent: rxn.one.comments({
      alias: "replies",
      from: rxn.comments.parent_id,
      to: rxn.comments.id,
    }),
    replies: rxn.many.comments({ alias: "replies" }),
  },
}));
