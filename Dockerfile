# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Astro/Prisma"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Astro/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# ── Build stage ────────────────────────────────────────────────────────────────
FROM base AS build

# Install packages needed to build node modules.
# git is required here (not just at runtime) because some dependencies or
# build scripts invoke it (e.g. to read the repo revision / tags).
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential node-gyp openssl pkg-config \
      python-is-python3 ca-certificates git && \
    rm -rf /var/lib/apt/lists/*

# Install node modules
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Generate Prisma Client
COPY prisma .
RUN pnpx prisma generate

# Copy application code
COPY . .

# Build application.
# ALL_SECRETS is a base64-encoded shell script that exports every Fly secret as
# an environment variable. It is produced by Dockerfile.builder / deploy.sh and
# injected via --build-secret at deploy time, making secrets available here
# without baking them into any image layer.
RUN --mount=type=secret,id=ALL_SECRETS \
    eval "$(base64 -d /run/secrets/ALL_SECRETS 2>/dev/null || true)" && \
    pnpm run build

# Remove development dependencies
RUN pnpm prune --prod

# ── Runtime stage ──────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-slim AS runtime

# Only runtime deps needed — git is not required at runtime
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y ca-certificates openssl wget && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

WORKDIR /app

# Copy built application from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# fly.toml sets internal_port = 80; app and healthcheck must match
EXPOSE 80

HEALTHCHECK CMD node -e "fetch('http://localhost:80').then(r=>{if(!r.ok)process.exit(1)})"

CMD ["node", "dist/server/entry.mjs"]
