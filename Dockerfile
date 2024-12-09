# Use the official Bun image
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies and copy the source code
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# [Optional] Run tests
RUN bun test

# Build the application
RUN bun run build

# Expose the application port
EXPOSE 3000/tcp

# Set non-root user and entrypoint
USER bun
ENTRYPOINT [ "bun", "run", "server" ]
