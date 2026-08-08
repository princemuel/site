#!/usr/bin/env python3
"""Generate a grouped, conventional-commit changelog markdown file.

Usage:
    python changelog.py --output-dir DIR [--from REV] [--to REV]

Equivalent to changelog.ps1: groups commits between --from and --to (default
HEAD) by their conventional-commit prefix (feat, fix, docs, ...), and writes
a markdown file named "<to>.md" in --output-dir.
"""

import argparse
import re
import subprocess
from pathlib import Path

# Order matters: this also controls section ordering in the output,
# mirroring the [ordered] hashtable in the PowerShell original.
SECTION_HEADERS = {
    "docs": "### \U0001f4d6 Documentation",
    "examples": "### \U0001f3c0 Examples",
    "feat": "### \U0001f680 Enhancements",
    "perf": "### \U0001f525 Performance",
    "fix": "### \U0001fa79 Fixes",
    "types": "### \U0001f30a Types",
    "refactor": "### \U0001f485 Refactors",
    "style": "### \U0001f3a8 Styles",
    "chore": "### \U0001f3e1 Chore",
    "test": "### \u2705 Tests",
    "build": "### \U0001f4e6 Build",
    "ci": "### \U0001f916 CI",
    "misc": "### \u267b\ufe0f Misc",
}

CONVENTIONAL_PREFIX = re.compile(r"^(.+?): (.*)$")


def run_git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args], check=True, capture_output=True, text=True
    )
    return result.stdout.strip()


def get_base_url() -> str:
    remote_url = run_git("remote", "get-url", "origin")
    return remote_url.replace(".github.io.git", "")


def get_commits(from_rev: str | None, to_rev: str) -> list[dict[str, str]]:
    range_spec = f"{from_rev}...{to_rev}" if from_rev else to_rev
    log_output = subprocess.run(
        ["git", "--no-pager", "log", range_spec, "--pretty=format:%h\t%s"],
        check=True,
        capture_output=True,
        text=True,
    ).stdout

    commits = []
    for line in log_output.splitlines():
        if not line.strip():
            continue
        commit_hash, _, message = line.partition("\t")

        match = CONVENTIONAL_PREFIX.match(message)
        if match:
            group, subject = match.group(1), match.group(2)
        else:
            group, subject = "misc", message

        if group not in SECTION_HEADERS:
            group = "misc"

        commits.append({"hash": commit_hash, "group": group, "message": subject})

    return commits


def group_commits(commits: list[dict[str, str]]) -> dict[str, list[dict[str, str]]]:
    grouped: dict[str, list[dict[str, str]]] = {key: [] for key in SECTION_HEADERS}
    for commit in commits:
        grouped[commit["group"]].append(commit)
    # Drop empty groups, preserve SECTION_HEADERS order.
    return {group: items for group, items in grouped.items() if items}


def write_changelog(
    dest_file: Path,
    base_url: str,
    changelog_date: str,
    from_rev: str | None,
    to_rev: str,
    grouped: dict[str, list[dict[str, str]]],
) -> None:
    lines = [
        "---",
        f"date: {changelog_date}",
        "versionName:",
        "---",
        "",
        f"[compare changes]({base_url}/compare/{from_rev or ''}...{to_rev})",
    ]

    for group, items in grouped.items():
        lines.append("")
        lines.append(SECTION_HEADERS[group])
        lines.append("")
        for item in items:
            lines.append(f"- {item['message']} ([{item['hash']}]({base_url}/commit/{item['hash']}))")

    dest_file.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a grouped changelog.")
    parser.add_argument("--from", dest="from_rev", default=None)
    parser.add_argument("--to", dest="to_rev", default="HEAD")
    parser.add_argument("--output-dir", required=True, type=Path)
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    dest_file = args.output_dir / f"{args.to_rev}.md"

    base_url = get_base_url()
    changelog_date = run_git("log", "-1", "--format=%cI", args.to_rev)
    commits = get_commits(args.from_rev, args.to_rev)
    grouped = group_commits(commits)

    write_changelog(dest_file, base_url, changelog_date, args.from_rev, args.to_rev, grouped)
    print(f"Wrote changelog to {dest_file}")


if __name__ == "__main__":
    main()
