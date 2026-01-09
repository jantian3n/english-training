# ============================================
# Multi-stage Dockerfile for Next.js 14+
# Optimized for production deployment
# ============================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on lock file
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client
RUN npx prisma generate

# Initialize database with schema
ENV DATABASE_URL="file:/app/prisma/data/dev.db"
RUN mkdir -p /app/prisma/data && npx prisma db push --skip-generate

# Build Next.js application
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/prisma/data/dev.db ./prisma/dev.db.template
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# CRITICAL: Create directory for SQLite database
RUN mkdir -p /app/prisma/data && chown -R nextjs:nodejs /app/prisma

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application (init DB if not exists)
CMD ["sh", "-c", "if [ ! -f /app/prisma/data/dev.db ]; then cp /app/prisma/dev.db.template /app/prisma/data/dev.db; fi && node server.js"]
