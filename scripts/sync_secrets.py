#!/usr/bin/env python3
"""Sync a .env file's key-value pairs to Fly.io secrets."""
# /// script
# dependencies = ["python-dotenv"]
# ///

import subprocess
import sys
from pathlib import Path

from dotenv import dotenv_values


def load_secrets(path: Path) -> dict[str, str]:
    values = dotenv_values(path)
    # dotenv_values can yield None for keys with no `=value` at all (e.g. `FOO` alone)
    return {k: v for k, v in values.items() if v is not None}


def set_fly_secrets(secrets: dict[str, str], app: str | None = None) -> None:
    if not secrets:
        print("No secrets to set.")
        return

    cmd = ["fly", "secrets", "set"]
    if app:
        cmd += ["--app", app]
    cmd += [f"{k}={v}" for k, v in secrets.items()]

    subprocess.run(cmd, check=True)


def main() -> None:
    env_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".env")
    app_name = sys.argv[2] if len(sys.argv) > 2 else None

    if not env_path.exists():
        sys.exit(f"No such file: {env_path}")

    secrets = load_secrets(env_path)
    print(f"Found {len(secrets)} secrets in {env_path}")
    set_fly_secrets(secrets, app_name)


if __name__ == "__main__":
    main()
