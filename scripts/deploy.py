# /// script
# dependencies = ["python-dotenv"]
# ///
"""Deploy to Fly.io, passing .env.production values as build secrets.

Mirrors deploy.sh: reads .env.production from the repo root (one directory
above this script), passes each KEY=VALUE as a --build-secret, and also
bundles everything into a single base64-encoded SECRETS build-secret.
"""

import base64
import subprocess
import sys
from pathlib import Path

from dotenv import dotenv_values

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
ENV_FILE = REPO_ROOT / ".env.production"


def main() -> None:
    if not ENV_FILE.is_file():
        print(f"Error: {ENV_FILE.name} not found", file=sys.stderr)
        sys.exit(1)

    values = dotenv_values(ENV_FILE)
    secrets = {k: v for k, v in values.items() if v}  # drop None/empty, like the original

    build_args: list[str] = []
    secrets_lines: list[str] = []
    for name, value in secrets.items():
        build_args += ["--build-secret", f"{name}={value}"]
        secrets_lines.append(f"export {name}={value}")

    secrets_blob = base64.b64encode("\n".join(secrets_lines).encode("utf-8")).decode("ascii")
    build_args += ["--build-secret", f"SECRETS={secrets_blob}"]

    subprocess.run(["flyctl", "deploy", *build_args], check=True, cwd=REPO_ROOT)


if __name__ == "__main__":
    main()
