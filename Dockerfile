# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=24.15.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Astro/Prisma"

# Astro/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=10.33.0
RUN npm install -g pnpm@${PNPM_VERSION}

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential git node-gyp openssl pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install node modules
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod=false --ignore-scripts

# Generate Prisma Client
COPY prisma .
RUN pnpm prisma generate

# Copy application code
COPY . .

# Build application using all secrets from the build context
RUN --mount=type=secret,id=ALL_SECRETS \
    eval "$(base64 -d /run/secrets/ALL_SECRETS)" && \
    echo "Using secrets during build!" && \
    pnpm run build

# Prune development dependencies for the final image
RUN pnpm prune --prod


# Final stage for app image
FROM base AS final

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Only what the server needs at runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY docker-entrypoint.js ./docker-entrypoint.js

RUN chmod +x ./docker-entrypoint.js

# Persistent volume for SQLite
RUN mkdir -p /data
VOLUME /data

ENV HOST="0.0.0.0"
ENV PORT="8080"

EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.js"]
CMD ["node", "/app/dist/server/entry.mjs"]
