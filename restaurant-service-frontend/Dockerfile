# 1. Use Node image to build the app
FROM node:20 AS build

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the application
COPY . .

# 6. Build the application
RUN npm run build

# 7. Use Nginx to serve the app
FROM nginx:stable-alpine

# 8. Copy the build output to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# 9. Copy custom nginx config (optional, for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 10. Expose port 3000
EXPOSE 3003

# 11. Start nginx
CMD ["nginx", "-g", "daemon off;"]
