#!/usr/bin/env python3
"""Print `filepath|date|hash;` for each .md/.mdx file's most recent git log
entry, skipping any commits in IGNORE_LIST. Runs in parallel across files,
same intent as the xargs -P pipeline in modified.sh.
"""

import os
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

CONTENT_DIR = Path("apps/site/content")
IGNORE_LIST = [
    "67f6075f51de7c62327fba114e9310774f94fb95",
]


def job_count() -> int:
    return os.cpu_count() or 4


def process_file(path: Path, ignore_pattern: re.Pattern[str]) -> str:
    result = subprocess.run(
        ["git", "log", "--follow", "--no-patch", "--date=iso", "--pretty=format:%cs|%H;", "--", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    lines = [line for line in result.stdout.splitlines() if not ignore_pattern.search(line)]
    entry = lines[0] if lines else ""
    return f"{path}|{entry}"


def main() -> None:
    ignore_pattern = re.compile("|".join(re.escape(h) for h in IGNORE_LIST))

    files = [
        p for p in CONTENT_DIR.rglob("*")
        if p.is_file() and p.suffix in (".md", ".mdx")
    ]

    with ThreadPoolExecutor(max_workers=job_count()) as pool:
        # ThreadPoolExecutor.map preserves input order, unlike shelling out to
        # xargs -P (whose output ordering is nondeterministic); switch to
        # `for future in as_completed(...)` below if original arrival order
        # (not file order) matters more to you than reproducibility.
        results = pool.map(lambda p: process_file(p, ignore_pattern), files)

    for result in results:
        print(result, end="")


if __name__ == "__main__":
    main()
