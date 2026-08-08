#!/usr/bin/env python3
"""Print git log entries as hash|iso-date|subject records.

Equivalent to:
    git --no-pager log --date=iso --pretty="format:%h$SEP$%cI$SEP$%s$END$"
"""

import subprocess

SEP = "$SEP$"
END = "$END$"


def main() -> None:
    result = subprocess.run(
        ["git", "--no-pager", "log", "--date=iso", f"--pretty=format:%h{SEP}%cI{SEP}%s{END}"],
        check=True,
        capture_output=True,
        text=True,
    )
    print(result.stdout, end="")


if __name__ == "__main__":
    main()
