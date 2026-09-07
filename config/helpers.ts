// oxlint-disable node/no-sync
import { execSync, spawnSync } from "node:child_process";
import { statSync } from "node:fs";

export const getGitCommit = (fallback = "unknown"): string => {
  try {
    const sha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    if (!/^[0-9a-f]{40}$/iu.test(sha)) throw new Error("Invalid git commit sha");
    return sha;
  } catch {
    return fallback;
  }
};

export const getFileModifiedTime = (
  path: string,
  options?: { format?: "author" | "commit"; datetime?: Temporal.Instant },
): Temporal.Instant => {
  const { format = "author", datetime = Temporal.Now.instant() } = options ?? {};
  if (!path || typeof path !== "string") return datetime;

  try {
    const dateFormat = format === "author" ? "%aI" : "%cI";
    const result = spawnSync("git", ["log", "-1", `--format=${dateFormat}`, "--", path], {
      encoding: "utf8",
      cwd: process.cwd(),
    });

    const output = result.stdout.trim();
    // Explicitly check for empty output (uncommitted files)
    if (result.status !== 0 || !output) {
      throw new Error("Not in git or no commits for this file");
    }
    return Temporal.Instant.from(output);
  } catch {
    try {
      // Fallback to FS mtime (ensure it's converted to strict ISO for Temporal)
      return statSync(path).mtimeInstant;
    } catch {
      return datetime;
    }
  }
};
