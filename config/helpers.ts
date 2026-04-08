import { execSync, spawnSync } from "node:child_process";
import { statSync } from "node:fs";

export const getGitCommit = (defaultValue?: string) => {
  try {
    return defaultValue || execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return defaultValue || "unknown";
  }
};

export const getFileModifiedTime = (
  filePath: string,
  options?: { useAuthor?: boolean }
): Temporal.Instant => {
  const { useAuthor = false } = options ?? {};
  if (!filePath || typeof filePath !== "string") return Temporal.Now.instant();

  try {
    const dateFormat = useAuthor ? "%aI" : "%cI";
    const result = spawnSync("git", ["log", "-1", `--format=${dateFormat}`, "--", filePath], {
      encoding: "utf8",
      cwd: process.cwd(),
    });

    const datetime = result.stdout?.trim();
    // Explicitly check for empty output (uncommitted files)
    if (result.status !== 0 || !datetime) {
      throw new Error("Not in git or no commits for this file");
    }
    return Temporal.Instant.from(datetime);
  } catch {
    try {
      // Fallback to FS mtime (ensure it's converted to strict ISO for Temporal)
      const stats = statSync(filePath);
      return stats.mtime.toTemporalInstant();
    } catch {
      return Temporal.Now.instant();
    }
  }
};
