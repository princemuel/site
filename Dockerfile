# syntax=docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=26
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Astro"

WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# package.json needs to exist so corepack can read packageManager from it
COPY package.json ./

# Corepack was removed from Node core in v25+, so install it explicitly
RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare --activate

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential git node-gyp openssl pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install node modules
COPY .yarnrc.yml yarn.lock ./
RUN yarn install --immutable --check-cache

# Copy application code
COPY . .

# Build application using all secrets from the build context
RUN --mount=type=secret,id=ALL_SECRETS \
    if [ ! -f /run/secrets/ALL_SECRETS ]; then \
    echo "ERROR: SECRETS build secret is missing" && exit 1; \
    fi && \
    eval "$(base64 -d /run/secrets/ALL_SECRETS)" && \
    yarn build

# Prune development dependencies for the final image
RUN yarn workspaces focus --production


# Final stage for app image
FROM base AS final

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Only what the server needs at runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY docker-entrypoint.mjs ./docker-entrypoint.mjs

RUN chmod +x ./docker-entrypoint.mjs

ENV HOST="0.0.0.0"
ENV PORT="8080"

EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.mjs"]
CMD ["node", "./dist/server/entry.mjs"]
