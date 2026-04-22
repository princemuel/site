# syntax = docker/dockerfile:1

FROM flyio/flyctl:latest AS flyio

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=24.15.0
FROM node:${NODE_VERSION}-slim AS base

RUN corepack enable pnpm

FROM debian:trixie-slim

RUN apt-get update && apt-get install -y ca-certificates jq && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy Node, npm, pnpm from the node stage
COPY --from=base /usr/local/bin/node /usr/local/bin/node
COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=base /usr/local/bin/npm /usr/local/bin/npm
COPY --from=base /usr/local/bin/pnpm /usr/local/bin/pnpm
COPY --from=base /usr/local/bin/npx /usr/local/bin/npx

COPY <<"EOF" /srv/deploy.sh
#!/bin/bash
set -euo pipefail

cd /build

deploy=(flyctl deploy)
touch /srv/.secrets

while read -r secret; do
  echo "export ${secret}=${!secret}" >> /srv/.secrets
  deploy+=(--build-secret "${secret}=${!secret}")
done < <(flyctl secrets list --json | jq -r ".[].name")

deploy+=(--build-secret "ALL_SECRETS=$(base64 --wrap=0 /srv/.secrets)")
${deploy[@]}
EOF

RUN chmod +x /srv/deploy.sh

COPY --from=flyio /flyctl /usr/bin

COPY . /build
