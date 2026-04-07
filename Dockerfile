# syntax = docker/dockerfile:1

# Multi-stage build for Astro + Prisma Node.js SSR deployment on Fly.io

ARG NODE_VERSION=24.12.0
FROM node:${NODE_VERSION}-slim AS base

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN coreutils enable

WORKDIR /app

# Install system dependencies required for building native modules
FROM base AS deps-installer
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    openssl \
    pkg-config \
    python-is-python3 \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install node_modules with pnpm
FROM deps-installer AS deps

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc* ./

# Copy all package.json files for proper monorepo resolution
COPY apps/site/package.json ./apps/site/
COPY pkgs/db/package.json ./pkgs/db/
COPY pkgs/utils/package.json ./pkgs/utils/

# Install all dependencies (frozen lockfile for reproducibility)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Generate Prisma Client
COPY pkgs/db/prisma ./pkgs/db/prisma
COPY pkgs/db/src ./pkgs/db/src
RUN pnpm --filter db db:generate

# Build stage - produce optimized application artifacts
FROM deps AS build

# Copy all source code
COPY apps/site ./apps/site
COPY pkgs/db ./pkgs/db
COPY pkgs/utils ./pkgs/utils

# Build the Astro site with static + SSR
RUN pnpm --filter site build

# Runtime stage - minimal production image
FROM base AS runtime

# Install runtime dependencies (much smaller than build stage)
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables for production
ENV NODE_ENV=production

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy database schema and Prisma Client
COPY --from=build /app/pkgs/db/node_modules ./pkgs/db/node_modules
COPY --from=build /app/pkgs/db/src ./pkgs/db/src
COPY --from=build /app/pkgs/db/prisma ./pkgs/db/prisma

# Copy utilities package
COPY --from=build /app/pkgs/utils ./pkgs/utils

# Copy built Astro app (.astro, .output, etc.)
COPY --from=build /app/apps/site/dist ./apps/site/dist
COPY --from=build /app/apps/site/.output ./apps/site/.output

# Copy package.json files needed at runtime
COPY apps/site/package.json ./apps/site/
COPY pkgs/db/package.json ./pkgs/db/
COPY pkgs/utils/package.json ./pkgs/utils/
COPY package.json pnpm-workspace.yaml ./

# Expose port for Fly.io (must match fly.toml internal_port)
EXPOSE 8080

# Health check for Fly.io
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "--import=tsx", "./apps/site/.output/server/entry.mjs"]
