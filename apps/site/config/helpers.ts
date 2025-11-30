// SPDX-License-Identifier: Apache-2.0
import { execSync, spawnSync } from "node:child_process";
import { statSync } from "node:fs";

export const getGitCommit = (defaultValue?: string) => {
  try {
    if (defaultValue) return defaultValue;
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};

export const getFileModifiedTime = (filePath: string): Temporal.Instant => {
  if (!filePath || typeof filePath !== "string") return Temporal.Now.instant();

  try {
    const result = spawnSync("git", ["log", "-1", "--pretty=format:%cI", filePath], {
      encoding: "utf8",
      cwd: process.cwd(),
    });

    if (result.status !== 0 || !result.stdout?.trim()) throw new Error("Git command failed or returned empty");

    return Temporal.Instant.from(result.stdout.trim());
  } catch {
    // Fallback to file system modified time if available
    try {
      const stats = statSync(filePath);
      return Temporal.Instant.from(stats.mtime.toISOString());
    } catch {
      return Temporal.Now.instant();
    }
  }
};
