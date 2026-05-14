# multi-stage Dockerfile for Angular apps
# build stage
FROM node:18-alpine AS builder
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# copy source and build (set BUILD_ENV at build time if needed)
COPY . .
ARG BUILD_ENV=production
RUN npm run build -- --configuration $BUILD_ENV --output-path=dist --base-href=/ \
    && mkdir -p /app/dist_out \
    && cp -r dist/* /app/dist_out/

# runtime stage using nginx to serve the built SPA
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/dist_out/ /usr/share/nginx/html

# serve index.html for all routes (SPA fallback)
RUN printf 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
      try_files $uri $uri/ /index.html; \
    } \
  }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]