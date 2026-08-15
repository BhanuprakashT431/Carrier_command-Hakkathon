# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json package-lock.json* ./

# Install all dependencies (including devDeps needed for Vite)
RUN npm install

# Copy source
COPY . .

# ── Development target ────────────────────────────────────────────────────────
# Used by docker-compose for hot-reload dev server
FROM base AS development

EXPOSE 3000

# Bind to 0.0.0.0 so the container port is accessible from the host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# ── Production build stage ────────────────────────────────────────────────────
FROM base AS builder

RUN npm run build

# ── Production serve stage ────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
