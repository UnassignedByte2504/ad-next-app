# syntax=docker/dockerfile:1
# =============================================================================
# BEMYRE Client - Multi-stage Dockerfile
# =============================================================================
# Build: docker build -t bemyre-client .
# Run:   docker run -p 3000:3000 bemyre-client
# =============================================================================

# -----------------------------------------------------------------------------
# Base: Bun runtime
# -----------------------------------------------------------------------------
FROM oven/bun:1.3-slim AS base
WORKDIR /app

# -----------------------------------------------------------------------------
# Dependencies: Install production dependencies
# -----------------------------------------------------------------------------
FROM base AS deps

# Install dependencies with cache mount for faster rebuilds
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# -----------------------------------------------------------------------------
# Builder: Build the Next.js application
# -----------------------------------------------------------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
# Note: Sentry source maps upload requires SENTRY_AUTH_TOKEN in CI
RUN bun run build

# -----------------------------------------------------------------------------
# Production: Minimal runtime image
# -----------------------------------------------------------------------------
FROM base AS production

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
# Next.js standalone output includes all necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start with bun for better performance
CMD ["bun", "run", "server.js"]

# -----------------------------------------------------------------------------
# Development: Full development environment
# -----------------------------------------------------------------------------
FROM base AS development

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
