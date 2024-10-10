# syntax=docker/dockerfile:1

###########################################
# BASE IMAGE
###########################################
FROM node:20.16 AS base

WORKDIR /app

ARG BUN_VERSION="1.1.22"
ENV HUSKY_SKIP_INSTALL=1
ENV HUSKY=0

RUN npm i -g bun@"$BUN_VERSION"

###########################################
# Install Project Depedencies
###########################################
FROM base AS install_deps

# Copy only file that required for install depedency
COPY ./bun.lockb ./bun.lockb
COPY ./package.json ./package.json

# Install all package dependencies
RUN bun install --frozen-lockfile

###########################################
# Build App
###########################################
FROM base AS build
COPY . .
COPY --from=install_deps /app/node_modules ./node_modules

# Set the environment variable
ENV NODE_ENV=production

# Run the build command
RUN bun run build admin
RUN bun run build vendor
RUN bun run build customer

###########################################
# Typechecking
###########################################
FROM base AS typecheck
COPY . .
COPY --from=install_deps /app/node_modules ./node_modules

RUN bun i --global vue-tsc
RUN bun run typecheck

###########################################
# Development Image
###########################################
FROM base AS development

# copy project
COPY . .
COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN npm i -g pm2@latest

# Install git for bun install to work in development
RUN apt-get update && apt-get install -y git && apt-get clean

# Set the environment variable
ENV NODE_ENV=development

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
###########################################
# Production Image
###########################################
FROM base AS production

COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint.sh
# Remove unnecessary packages
RUN rm -rf /var/lib/apt/lists/*

# Set the environment variable
ENV NODE_ENV=production

# Copy the output from the build stage
COPY --from=build /app/dist/apps .
COPY --from=install_deps /app/node_modules ./node_modules

# TODO: WE MUST NOT USE ROOT USER
# Switch to the non-root user
# need to make sure app can write something
# USER node

RUN chmod +x /usr/local/bin/entrypoint.sh

# Command to run the application
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

