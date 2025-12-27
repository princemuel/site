#!/usr/bin/env bash

set -euo pipefail

# Configuration
DB_NAME="${DB_NAME:-sahara}"
MIGRATIONS_DIR="./pkgs/nsdb/prisma/migrations"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if migrations directory exists
if [[ ! -d "$MIGRATIONS_DIR" ]]; then
    log_error "Migrations directory not found: $MIGRATIONS_DIR"
    exit 1
fi

# Find all migration directories and sort them by timestamp in the directory name
# The format is typically: YYYYMMDDHHMMSS_description
migrations=$(find "$MIGRATIONS_DIR" -mindepth 1 -maxdepth 1 -type d | sort)

if [[ -z "$migrations" ]]; then
    log_warn "No migrations found in $MIGRATIONS_DIR"
    exit 0
fi

migration_count=$(echo "$migrations" | wc -l)
log_info "Found $migration_count migration(s) to apply"
echo

# Apply each migration
for migration_dir in $migrations; do
    migration_name=$(basename "$migration_dir")
    migration_file="$migration_dir/migration.sql"

    if [[ ! -f "$migration_file" ]]; then
        log_warn "Skipping $migration_name: migration.sql not found"
        continue
    fi

    log_info "Applying migration: $migration_name"

    if turso db shell "$DB_NAME" <"$migration_file"; then
        log_info "✓ Successfully applied: $migration_name"
    else
        log_error "✗ Failed to apply: $migration_name"
        exit 1
    fi

    echo
done

log_info "All migrations applied successfully!"
