#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPTPATH="$(
  cd "$(dirname "$0")" || exit
  pwd -P
)"

cd "$SCRIPTPATH" || exit
cd ..

ENV_FILE=".env.production"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

build_args=()
secrets_content=""

while IFS='=' read -r name value; do
  # Skip comments and empty lines
  [[ "$name" =~ ^#.*$ || -z "$name" ]] && continue
  # Strip inline comments and surrounding quotes from value
  value=$(echo "$value" | sed 's/#.*//' | tr -d '"' | tr -d "'" | xargs)
  [[ -z "$value" ]] && continue

  build_args+=(--build-secret "${name}=${value}")
  secrets_content+="export ${name}=${value}\n"
done <"$ENV_FILE"

# Pass all secrets as a single base64-encoded blob
build_args+=(--build-secret "SECRETS=$(printf '%b' "$secrets_content" | base64 --wrap=0)")

flyctl deploy "${build_args[@]}"
