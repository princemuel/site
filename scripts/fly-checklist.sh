#!/bin/bash
# Fly.io Pre-Deployment Checklist
# Run this script to verify your environment before deploying

set -e

echo "🔍 Fly.io Deployment Checklist"
echo "================================"
echo ""

# Check flyctl installation
echo "✓ Checking flyctl..."
if ! command -v flyctl &>/dev/null; then
    echo "✗ flyctl not found. Install from https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi
echo "  flyctl version: $(flyctl version)"

# Check flyctl authentication
echo "✓ Checking Fly.io authentication..."
if ! flyctl auth whoami &>/dev/null; then
    echo "✗ Not authenticated with Fly.io. Run: flyctl auth login"
    exit 1
fi
echo "  Authenticated as: $(flyctl auth whoami)"

# Check Docker
echo "✓ Checking Docker..."
if ! command -v docker &>/dev/null; then
    echo "⚠ Docker not found. Fly.io will use remote builders."
    echo "  (This is fine, but slower. Install Docker for faster builds.)"
else
    echo "  Docker is available"
fi

# Check pnpm
echo "✓ Checking pnpm..."
if ! command -v pnpm &>/dev/null; then
    echo "✗ pnpm not found. Install from https://pnpm.io"
    exit 1
fi
echo "  pnpm version: $(pnpm --version)"

# Check Node.js
echo "✓ Checking Node.js..."
node_version=$(node --version)
echo "  Node.js version: $node_version"

# Check if app exists on Fly.io
echo "✓ Checking Fly.io app..."
if flyctl apps list | grep -q "site-silent-sunset-6214"; then
    echo "  App found: site-silent-sunset-6214"
else
    echo "⚠ App 'site-silent-sunset-6214' not found on Fly.io"
    echo "  You can:"
    echo "    1) Change app name in fly.toml and let Fly create it"
    echo "    2) Create it manually: flyctl apps create site-silent-sunset-6214"
fi

# Check CLI version compatibility
echo "✓ Checking environment configuration..."
if [ -f "fly.toml" ]; then
    echo "  ✓ fly.toml found"
else
    echo "✗ fly.toml not found in current directory"
    exit 1
fi

if [ -f "Dockerfile" ]; then
    echo "  ✓ Dockerfile found"
else
    echo "✗ Dockerfile not found in current directory"
    exit 1
fi

if [ -f "pnpm-lock.yaml" ]; then
    echo "  ✓ pnpm-lock.yaml found"
else
    echo "✗ pnpm-lock.yaml not found. Run: pnpm install"
    exit 1
fi

# Check for required environment secrets
echo "✓ Checking Fly.io secrets..."
secrets=$(flyctl secrets list 2>/dev/null | tail -n +2 | cut -d' ' -f1)
required_secrets=(
    "DATABASE_URL"
    "DATABASE_TOKEN"
    "ASTRO_KEY"
    "OCTOKIT_TOKEN"
    "RESEND_TOKEN"
)

missing_secrets=()
for secret in "${required_secrets[@]}"; do
    if echo "$secrets" | grep -q "$secret"; then
        echo "  ✓ $secret"
    else
        echo "  ✗ $secret (MISSING)"
        missing_secrets+=("$secret")
    fi
done

if [ ${#missing_secrets[@]} -gt 0 ]; then
    echo ""
    echo "⚠ Missing secrets. Set them with:"
    echo "  flyctl secrets set SECRET_NAME=secret_value"
    echo ""
    echo "See FLY_DEPLOYMENT.md for all required secrets."
fi

echo ""
echo "================================"
echo "✓ Pre-deployment checks complete!"
echo ""
echo "Ready to deploy? Run:"
echo "  flyctl deploy"
echo ""
echo "To monitor deployment:"
echo "  flyctl logs -f"
