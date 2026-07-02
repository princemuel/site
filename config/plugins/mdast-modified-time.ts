import { fileURLToPath } from "node:url";
import type { MdastPluginDefinition } from "satteri";
import { getFileModifiedTime } from "../helpers";

export function MdastModifiedTime(): MdastPluginDefinition {
  return {
    name: "mdast-modified-time",
    text(_node, ctx) {
      if (!ctx.fileURL || !ctx.data.astro?.frontmatter) return;

      const { frontmatter } = ctx.data.astro;
      const __filename = fileURLToPath(ctx.fileURL);
      // Skip files without date
      if (!frontmatter.date || !__filename) return;
      try {
        const time_modified = getFileModifiedTime(__filename);
        const published = Temporal.Instant.from(frontmatter.date);
        const days_since_pub = time_modified.since(published).total("days");

        // Get the latest revision date if revisions exist
        const latest_revision =
          frontmatter.revisions?.length > 0
            ? Temporal.Instant.from(frontmatter.revisions.at(-1).date)
            : undefined;

        // Only auto-set updated if:
        // 1. No manual updated already set
        // 2. More than 1 day since publish
        // 3. Git shows changes newer than latest revision (or no revisions exist)
        const updated =
          !frontmatter.updated &&
          Math.abs(days_since_pub) > 1 &&
          (!latest_revision || Temporal.Instant.compare(time_modified, latest_revision) > 0);

        if (updated) frontmatter.updated = time_modified.toString();
      } catch (error) {
        console.warn(`[MdastModifiedTime] skipped "${__filename}":`, error);
      }
    },
  };
}
