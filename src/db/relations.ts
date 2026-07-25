import { defineRelations } from "drizzle-orm";

import * as schema from "./models";

export const relations = defineRelations({ ...schema }, (r) => ({
  comments: {
    post: r.one.posts({ from: r.comments.post_id, to: r.posts.id }),
    actor: r.one.actors({ from: r.comments.actor_id, to: r.actors.id }),
    parent: r.one.comments({ from: r.comments.parent_id, to: r.comments.id, alias: "replies" }),
    replies: r.many.comments({ alias: "replies" }),
  },
}));
