#!/usr/bin/env python3
"""Fly.io pre-deployment checklist. Run before deploying."""

import shutil
import subprocess
import sys
from pathlib import Path

REQUIRED_SECRETS = [
    "DATABASE_URL",
    "DATABASE_TOKEN",
    "ASTRO_KEY",
    "OCTOKIT_TOKEN",
    "RESEND_TOKEN",
]
APP_NAME = "site-silent-sunset-6214"


def run(*args: str) -> tuple[int, str]:
    try:
        result = subprocess.run(args, capture_output=True, text=True, check=False)
        return result.returncode, result.stdout.strip()
    except FileNotFoundError:
        return 127, ""


def check_command(name: str, install_hint: str | None = None, required: bool = True) -> bool:
    if shutil.which(name):
        return True
    marker = "\u2717" if required else "\u26a0"
    print(f"{marker} {name} not found." + (f" {install_hint}" if install_hint else ""))
    return False


def main() -> None:
    print("\U0001f50d Fly.io Deployment Checklist")
    print("=" * 32)
    print()

    failed = False

    print("\u2713 Checking flyctl...")
    if not check_command("flyctl", "Install from https://fly.io/docs/getting-started/installing-flyctl/"):
        sys.exit(1)
    _, version = run("flyctl", "version")
    print(f"  flyctl version: {version}")

    print("\u2713 Checking Fly.io authentication...")
    code, whoami = run("flyctl", "auth", "whoami")
    if code != 0:
        print("\u2717 Not authenticated with Fly.io. Run: flyctl auth login")
        sys.exit(1)
    print(f"  Authenticated as: {whoami}")

    print("\u2713 Checking Docker...")
    if not check_command("docker", required=False):
        print("  (This is fine, but slower. Install Docker for faster builds.)")
    else:
        print("  Docker is available")

    print("\u2713 Checking pnpm...")
    if not check_command("pnpm", "Install from https://pnpm.io"):
        sys.exit(1)
    _, pnpm_version = run("pnpm", "--version")
    print(f"  pnpm version: {pnpm_version}")

    print("\u2713 Checking Node.js...")
    _, node_version = run("node", "--version")
    print(f"  Node.js version: {node_version}")

    print("\u2713 Checking Fly.io app...")
    _, apps_list = run("flyctl", "apps", "list")
    if APP_NAME in apps_list:
        print(f"  App found: {APP_NAME}")
    else:
        print(f"\u26a0 App '{APP_NAME}' not found on Fly.io")
        print("  You can:")
        print("    1) Change app name in fly.toml and let Fly create it")
        print(f"    2) Create it manually: flyctl apps create {APP_NAME}")

    print("\u2713 Checking environment configuration...")
    for filename in ("fly.toml", "Dockerfile", "pnpm-lock.yaml"):
        if Path(filename).is_file():
            print(f"  \u2713 {filename} found")
        else:
            hint = "  Run: pnpm install" if filename == "pnpm-lock.yaml" else ""
            print(f"\u2717 {filename} not found in current directory{('. ' + hint) if hint else ''}")
            failed = True

    if failed:
        sys.exit(1)

    print("\u2713 Checking Fly.io secrets...")
    _, secrets_output = run("flyctl", "secrets", "list")
    existing_secrets = secrets_output.splitlines()[1:] if secrets_output else []
    existing_names = {line.split()[0] for line in existing_secrets if line.strip()}

    missing_secrets = []
    for secret in REQUIRED_SECRETS:
        if secret in existing_names:
            print(f"  \u2713 {secret}")
        else:
            print(f"  \u2717 {secret} (MISSING)")
            missing_secrets.append(secret)

    if missing_secrets:
        print()
        print("\u26a0 Missing secrets. Set them with:")
        print("  flyctl secrets set SECRET_NAME=secret_value")
        print()
        print("See FLY_DEPLOYMENT.md for all required secrets.")

    print()
    print("=" * 32)
    print("\u2713 Pre-deployment checks complete!")
    print()
    print("Ready to deploy? Run:")
    print("  flyctl deploy")
    print()
    print("To monitor deployment:")
    print("  flyctl logs -f")


if __name__ == "__main__":
    main()
