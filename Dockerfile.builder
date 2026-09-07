# syntax=docker/dockerfile:1

FROM flyio/flyctl:latest AS flyio
FROM python:3.14-slim-trixie

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && \
  rm -rf /var/lib/apt/lists/*

COPY --from=flyio /flyctl /usr/bin/flyctl

COPY <<"EOF" /srv/deploy.py
#!/usr/bin/env python3
"""Promote Fly secrets to build secrets.

Fly secret VALUES aren't retrievable via `flyctl secrets list` (Fly only
exposes names). This assumes the current environment already holds a
matching value for every secret name Fly knows about (e.g. via .env/direnv
or CI-injected secrets), and passes each through as a --build-secret,
plus one bundled base64-encoded ALL_SECRETS build-secret.
"""

import base64
import json
import os
import shlex
import subprocess
import sys


def main() -> None:
    result = subprocess.run(
        ["flyctl", "secrets", "list", "--json"],
        check=True,
        capture_output=True,
        text=True,
    )
    secret_names = [s["name"] for s in json.loads(result.stdout)]

    build_args: list[str] = []
    secrets_lines: list[str] = []
    missing: list[str] = []

    for name in secret_names:
        value = os.environ.get(name)
        if value is None:
            missing.append(name)
            continue
        build_args += ["--build-secret", f"{name}={value}"]
        secrets_lines.append(f"export {name}={shlex.quote(value)}")

    if missing:
        print(
            f"Error: Fly knows about these secrets but no local env value was found: "
            f"{', '.join(missing)}",
            file=sys.stderr,
        )
        sys.exit(1)

    secrets_blob = base64.b64encode(
        "\n".join(secrets_lines).encode("utf-8")
    ).decode("ascii")
    build_args += ["--build-secret", f"SECRETS={secrets_blob}"]

    subprocess.run(["flyctl", "deploy", *build_args], check=True)


if __name__ == "__main__":
    main()
EOF

RUN chmod +x /srv/deploy.py

WORKDIR /build
COPY . .

ENTRYPOINT ["python3", "/srv/deploy.py"]
