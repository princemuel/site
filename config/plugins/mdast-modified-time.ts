import { fileURLToPath } from "node:url";

import { getFileModifiedTime } from "../helpers.ts";
import type { MdastPluginDefinition } from "./types.ts";

export const mdast_modified_time: MdastPluginDefinition = {
  name: "mdast-modified-time",
  before(_root, ctx) {
    if (!ctx.fileURL || !ctx.data.astro) return;

    const { frontmatter } = ctx.data.astro;
    const filename = fileURLToPath(ctx.fileURL);
    // Skip files without date
    if (!frontmatter.date || !filename) return;
    try {
      const time_modified = getFileModifiedTime(filename);
      const published = Temporal.Instant.from(frontmatter.date);
      const days_since_pub = time_modified.since(published).total("days");

      // Get the latest revision date if revisions exist
      const latest_revision = frontmatter.revisions
        ? Temporal.Instant.from(frontmatter.revisions.at(-1)?.date ?? "")
        : undefined;

      // Only auto-set updated if:
      // 1. No manual updated already set
      // 2. More than 1 day since publish
      // 3. Git shows changes newer than latest revision (or no revisions exist)
      const updated =
        !frontmatter.updated &&
        Math.abs(days_since_pub) > 1 &&
        (!latest_revision || Temporal.Instant.compare(time_modified, latest_revision) > 0);

      if (updated) ctx.data.astro.frontmatter.updated = time_modified.toString();
    } catch (error) {
      console.warn(`[MdastModifiedTime] skipped "${filename}":`, error);
    }
  },
};
