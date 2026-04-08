# syntax=docker/dockerfile:1.7

# --- build stage ---
FROM node:25-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Build args (add per project as needed)
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY . ./
RUN npm run build \
 && echo "{\"version\":\"$(node -p "require('./package.json').version")\",\"buildDate\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > dist/version.json

# --- runtime stage ---
FROM nginx:1.29-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
