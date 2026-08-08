#!/usr/bin/env python3
"""Recursively rename files from one extension to another.

Usage:
    python rename_ext.py --from mdx --to md [--dir .]

Leading dots are optional on --from/--to (both "md" and ".md" work).
"""

import argparse
import sys
from pathlib import Path


def normalize_ext(ext: str) -> str:
    return ext if ext.startswith(".") else f".{ext}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Recursively rename files by extension.")
    parser.add_argument("--from", dest="from_ext", required=True, help="Extension to rename from, e.g. mdx")
    parser.add_argument("--to", dest="to_ext", required=True, help="Extension to rename to, e.g. md")
    parser.add_argument("--dir", dest="target_dir", default=".", type=Path, help="Directory to search (default: current dir)")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be renamed without renaming")
    args = parser.parse_args()

    from_ext = normalize_ext(args.from_ext)
    to_ext = normalize_ext(args.to_ext)

    if not args.target_dir.is_dir():
        print(f"Error: {args.target_dir} is not a directory", file=sys.stderr)
        sys.exit(1)

    if from_ext == to_ext:
        print("Error: --from and --to are the same extension", file=sys.stderr)
        sys.exit(1)

    matches = list(args.target_dir.rglob(f"*{from_ext}"))

    if not matches:
        print(f"No {from_ext} files found under {args.target_dir}")
        return

    for path in matches:
        new_path = path.with_suffix(to_ext)

        if new_path.exists():
            print(f"Skipping (target exists): {path} -> {new_path}", file=sys.stderr)
            continue

        if args.dry_run:
            print(f"Would rename: {path} -> {new_path}")
            continue

        path.rename(new_path)
        print(f"Renamed: {path} -> {new_path}")

    verb = "would be" if args.dry_run else "have been"
    print(f"All {from_ext} files under {args.target_dir} {verb} renamed to {to_ext}.")


if __name__ == "__main__":
    main()
