#!/usr/bin/env bash

set -euo pipefail

# Capture the token on its own, quoted, so any stray stdout noise
# (warnings, metrics errors, etc.) doesn't leak into the token string.
token="$(fly tokens create deploy)"

# Sanity-check: a Fly deploy token should be a single line starting with FlyV1
if [[ "$(printf '%s' "$token" | wc -l)" -ne 0 ]] || [[ $token != FlyV1* ]]; then
  echo "Error: unexpected output from 'fly tokens create deploy':" >&2
  echo "$token" >&2
  exit 1
fi

flyctl console \
  --dockerfile Dockerfile.builder \
  -C "/srv/deploy.py" \
  --env "FLY_API_TOKEN=${token}"
