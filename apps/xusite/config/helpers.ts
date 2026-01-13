// SPDX-License-Identifier: Apache-2.0
import { execSync, spawnSync } from "node:child_process";
import { statSync } from "node:fs";

export const getGitCommit = (defaultValue?: string) => {
  try {
    if (defaultValue) return defaultValue;
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return defaultValue || "unknown";
  }
};

export const getFileModifiedTime = (
  filePath: string,
  options?: { useAuthorDate?: boolean },
): Temporal.Instant => {
  const { useAuthorDate = false } = options ?? {};

  if (!filePath || typeof filePath !== "string") return Temporal.Now.instant();

  try {
    // %cI = committer date (when commit was applied)
    // %aI = author date (when changes were originally made)
    const dateFormat = useAuthorDate ? "%aI" : "%cI";
    const result = spawnSync(
      "git",
      ["log", "-1", `--pretty=format:${dateFormat}`, "--", filePath],
      { encoding: "utf8", cwd: process.cwd() },
    );

    if (result.status !== 0 || !result.stdout?.trim()) {
      throw new Error("Git command failed or returned empty");
    }

    return Temporal.Instant.from(result.stdout.trim());
  } catch {
    // Fallback to file system modified time
    try {
      const stats = statSync(filePath);
      return Temporal.Instant.from(stats.mtime.toISOString());
    } catch {
      // Last resort: current time
      return Temporal.Now.instant();
    }
  }
};
