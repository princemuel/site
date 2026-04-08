# syntax = docker/dockerfile:1
#
# Dockerfile.builder — ephemeral launcher used to inject Fly secrets at build time.
#
# Usage:
#   flyctl console \
#     --dockerfile Dockerfile.builder \
#     -C "/srv/deploy.sh" \
#     --env=FLY_API_TOKEN=$(fly auth token)
#
# How it works:
#   deploy.sh reads every secret already set on your Fly app via `flyctl secrets
#   list`, passes each one as an individual --build-secret to `fly deploy`, and
#   also bundles them all into a single ALL_SECRETS build-secret (a base64-
#   encoded shell export script). The main Dockerfile mounts ALL_SECRETS and
#   evals it before running `pnpm build`, so every env var is present during
#   Astro's static prerender step.

FROM flyio/flyctl:latest AS flyio
FROM debian:trixie-slim

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y ca-certificates jq && \
    rm -rf /var/lib/apt/lists/*

# Heredoc syntax requires BuildKit (already enabled via the `# syntax` directive)
COPY <<"EOF" /srv/deploy.sh
#!/bin/bash
set -euo pipefail

deploy=(flyctl deploy)
touch /srv/.secrets

# Iterate over every secret name registered with the Fly app.
# Each secret's *value* is available as an env var of the same name because
# `flyctl console --env KEY=VALUE` injects them into the machine's environment.
while read -r secret; do
  if [[ -z "${!secret+x}" ]]; then
    echo "WARNING: secret '$secret' listed but not found in environment, skipping." >&2
    continue
  fi
  echo "export ${secret}=${!secret}" >> /srv/.secrets
  deploy+=(--build-secret "${secret}=${!secret}")
done < <(flyctl secrets list --json | jq -r ".[].name")

deploy+=(--build-secret "ALL_SECRETS=$(base64 --wrap=0 /srv/.secrets)")

echo "Running: ${deploy[*]}" >&2
"${deploy[@]}"
EOF

RUN chmod +x /srv/deploy.sh

COPY --from=flyio /flyctl /usr/bin

WORKDIR /build
COPY . .
