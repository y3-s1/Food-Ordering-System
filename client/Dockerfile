# ----------- Builder Stage -----------
    FROM node:18-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy package manifests
    COPY package.json package-lock.json* yarn.lock* ./
    
    # Install dependencies
    # If you use npm:
    RUN npm ci
    # If you use yarn, replace with:
    # RUN yarn install --frozen-lockfile
    
    # Copy the rest of the source code
    COPY . .
    
    # Build the production assets
    RUN npm run build
    # or: RUN yarn build
    
    # ----------- Production Stage -----------
    FROM nginx:alpine AS production
    
    # Remove default nginx website
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy built assets from builder
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Copy custom nginx config (optional)
    # COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Expose port 80
    EXPOSE 80
    
    # Healthcheck (optional)
    HEALTHCHECK --interval=30s --timeout=3s \
      CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
    
    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]
    