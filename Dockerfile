# Fineliner's site: a static Astro build served by nginx (deploy/nginx.conf). The registry (public/r) and the share
# images (/og) ship with it. Optional build argument SITE_URL overrides the canonical URL in astro.config.mjs.

FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG SITE_URL
ENV SITE_URL=${SITE_URL}
RUN npm run build

FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
