import { execSync, spawnSync } from "node:child_process";
import { statSync } from "node:fs";

export const getGitCommit = (fallback = "unknown"): string => {
  try {
    const sha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    if (!/^[0-9a-f]{40}$/i.test(sha)) throw new Error("Invalid git commit sha");
    return sha;
  } catch {
    return fallback;
  }
};

export const getFileModifiedTime = (
  path: string,
  options?: { byAuthor?: boolean },
): Temporal.Instant => {
  const { byAuthor: useAuthor = true } = options ?? {};
  if (!path || typeof path !== "string") return Temporal.Now.instant();

  try {
    const dateFormat = useAuthor ? "%aI" : "%cI";
    const result = spawnSync("git", ["log", "-1", `--format=${dateFormat}`, "--", path], {
      encoding: "utf8",
      cwd: process.cwd(),
    });

    const datetime = result.stdout.trim();
    // Explicitly check for empty output (uncommitted files)
    if (result.status !== 0 || !datetime) {
      throw new Error("Not in git or no commits for this file");
    }
    return Temporal.Instant.from(datetime);
  } catch (error) {
    console.warn(`[getFileModifiedTime] git failed for "${path}":`, error);
    try {
      // Fallback to FS mtime (ensure it's converted to strict ISO for Temporal)
      const stats = statSync(path);
      // @ts-expect-error mtimeInstant is available in newer Node versions, but not yet in types
      return stats.mtimeInstant ?? Temporal.Now.instant();
    } catch (exception) {
      console.warn(`[getFileModifiedTime] fs.statSync failed for "${path}":`, exception);
      return Temporal.Now.instant();
    }
  }
};
