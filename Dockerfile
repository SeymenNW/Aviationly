# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine as base

ENV NODE_ENV=production

WORKDIR /app


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
FROM base as release

COPY --from=prerelease /build/index.js /build/index.js
COPY --from=install /temp/prod/package.json /package.json

EXPOSE 5000/tcp

ENTRYPOINT [ "bun", "run", "run-build" ]
