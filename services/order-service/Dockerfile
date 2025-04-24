### Dockerfile for Order Service (TypeScript)

# --- Stage 1: Build ---
FROM node:17-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript project
RUN npm run build

# --- Stage 2: Production Image ---
FROM node:18-alpine

# Set NODE_ENV for production and working directory
ENV NODE_ENV=production
WORKDIR /app

# Copy package manifests and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/config ./config
COPY --from=builder /app/src/routes ./routes
COPY --from=builder /app/src/middleware ./middleware

# Expose service port
EXPOSE 5002

# Define default startup command
CMD ["node", "dist/index.js"]
