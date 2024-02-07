# syntax=docker/dockerfile:experimental

# Build stage: Install dependencies
# ===
FROM node:20 AS node
WORKDIR /srv
ADD package.json .
ADD package-lock.json .
RUN --mount=type=cache,target=~/.npm npm install

# Build stage: Run "npm run build-storybook"
# ===
FROM node AS build-js
ADD . .
RUN npm run build-storybook

# Build the production image
# ===
FROM ubuntu:jammy

# Set up environment
ENV LANG C.UTF-8
WORKDIR /srv

RUN apt-get update && apt-get install --no-install-recommends --yes python3

# Import code, build assets and mirror list
ADD . .
COPY --from=build-js srv/storybook-static .

# Setup commands to run server
ENTRYPOINT ["python3"]
CMD ["-m", "http.server", "80"]
