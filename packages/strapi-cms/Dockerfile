# Multi-stage build for Strapi CMS
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Development image
FROM base AS development
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
EXPOSE 1337

CMD ["npm", "run", "develop"]

# Build for production
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build

# Production image
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 strapi

COPY --from=builder --chown=strapi:nodejs /app/dist ./dist
COPY --from=builder --chown=strapi:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=strapi:nodejs /app/package.json ./package.json
COPY --from=builder --chown=strapi:nodejs /app/config ./config
COPY --from=builder --chown=strapi:nodejs /app/src ./src
COPY --from=builder --chown=strapi:nodejs /app/public ./public

USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
