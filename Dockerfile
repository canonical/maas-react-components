# syntax=docker/dockerfile:experimental

FROM node:22 AS npm-dependencies
WORKDIR /srv
COPY package*.json ./
RUN --mount=type=cache,target=~/.npm npm ci
COPY . .

FROM npm-dependencies AS build-js
RUN npm run build-storybook

FROM ubuntu:jammy
ENV LANG C.UTF-8
WORKDIR /srv
RUN apt-get update && apt-get install --no-install-recommends --yes python3
COPY --from=build-js /srv/storybook-static .

ENTRYPOINT ["python3"]
CMD ["-m", "http.server", "80"]
