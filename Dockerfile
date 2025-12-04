# Production Dockerfile for Vue.js frontend
# Builds static files and copies them to a volume mount point for nginx to serve
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Final stage - copy files and setup entrypoint
FROM alpine:latest

# Create directory for static files in image
RUN mkdir -p /app/static

# Copy built files from builder to image
COPY --from=builder /app/dist /app/static

# Create entrypoint script to copy files to mounted volume on startup
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo '# Copy built files to mounted volume (data-prod/static)' >> /entrypoint.sh && \
    echo 'echo "Copying static files to /usr/share/nginx/html (data-prod/static)..."' >> /entrypoint.sh && \
    echo 'cp -r /app/static/* /usr/share/nginx/html/ 2>/dev/null || true' >> /entrypoint.sh && \
    echo 'echo "Static files copied. Container ready."' >> /entrypoint.sh && \
    echo '# Keep container running' >> /entrypoint.sh && \
    echo 'exec sh -c "while true; do sleep 3600; done"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

