FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

WORKDIR /app
COPY pnpm-lock.yaml .
RUN pnpm fetch

COPY . .
RUN pnpm install --offline
RUN pnpm run build

FROM nginx:1.24-alpine-slim AS deploy

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 80
