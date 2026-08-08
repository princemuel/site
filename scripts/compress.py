# /// script
# dependencies = ["brotli"]
# ///
"""Compress a JSON file with Gzip and Brotli.

Usage:
    uv run compress.py <input.json> [--out <outputBasePath>]

Outputs: <outputBasePath>.gz, <outputBasePath>.br
"""

import argparse
import gzip
import json
import sys
from pathlib import Path

import brotli


def format_size(num_bytes: int) -> str:
    return f"{num_bytes / 1024:.2f} KiB"


def compress_json(json_data: object, base_path: Path) -> None:
    minified = json.dumps(json_data, separators=(",", ":"))
    buffer = minified.encode("utf-8")

    compressions = {
        "gzip": gzip.compress(buffer, compresslevel=9),
        "brotli": brotli.compress(buffer, quality=11),
    }

    print(f"ORIGINAL: {format_size(len(buffer))}")

    for kind, data in compressions.items():
        ratio = (len(data) / len(buffer)) * 100
        extension = "br" if kind == "brotli" else kind
        out_path = base_path.with_name(f"{base_path.name}.{extension}")
        out_path.write_bytes(data)
        print(f"{kind.upper()}: {format_size(len(data))} ({ratio:.1f}% of original) -> {out_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Compress JSON using Gzip and Brotli.")
    parser.add_argument("input", type=Path)
    parser.add_argument("--out", dest="output", type=Path, default=None)
    args = parser.parse_args()

    input_path = args.input.resolve()
    output_path = (args.output or args.input).resolve()

    if not input_path.exists():
        print(f"\u274c Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    try:
        content = input_path.read_text(encoding="utf-8")
        data = json.loads(content)
        compress_json(data, output_path)
    except Exception as error:  # noqa: BLE001 - mirrors the original's catch-all
        print(f"\u274c Error: {error}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
