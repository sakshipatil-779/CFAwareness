# ═══════════════════════════════════════════════════════════════════
# EcoQuest Backend — Multi-stage Dockerfile
# Target: Google Cloud Run (port 8080, non-root user)
# ═══════════════════════════════════════════════════════════════════

# ──────────────────────────────────────────────
# Stage 1: Build
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies first (layer-cache optimisation)
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source and compile TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ──────────────────────────────────────────────
# Stage 2: Production runtime
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs ecoquest

WORKDIR /app

# Copy only production artifacts
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder --chown=ecoquest:nodejs /app/dist ./dist

USER ecoquest

# Cloud Run standard port
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "dist/index.js"]
