# ==============================================================================
# EcoQuest Central Production Dockerfile (Root Level)
# Multi-stage build optimized for minimal container size and enhanced security
# Target: Google Cloud Run, Railway, AWS EC2
# ==============================================================================

# ──────────────────────────────────────────────
# Stage 1: Build Backend TypeScript Code
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install build dependencies for native node-modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies first (layer-cache optimisation)
COPY backend/package*.json ./
RUN npm ci --ignore-scripts

# Copy tsconfig and source files
COPY backend/tsconfig.json ./
COPY backend/src ./src

# Compile TypeScript to JavaScript (dist/)
RUN npm run build

# ──────────────────────────────────────────────
# Stage 2: Minimal Production Runtime
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

# Security: Run the container under a non-root system user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs ecoquest

WORKDIR /app

# Copy package configurations and clean-install ONLY production dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy compiled source files from Builder Stage
COPY --from=builder --chown=ecoquest:nodejs /app/dist ./dist

# Apply security ownership to application files
USER ecoquest

# Establish environment parameters
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Health check setup for container runtime verification
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

# Start Server
CMD ["node", "dist/index.js"]
