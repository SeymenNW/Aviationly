# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine AS base

ENV NODE_ENV=production

WORKDIR /backend


# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --ignore-scripts --production


# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

RUN bun run build


# copy production dependencies and build output
FROM base AS release

COPY --from=prerelease /backend/build/index.js /backend/build/index.js
COPY --from=install /temp/prod/package.json /backend/package.json

EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "run", "run-build" ]