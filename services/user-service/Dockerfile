# Use an official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies without running lifecycle scripts
RUN npm install --ignore-scripts

# Copy the rest of the code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port (match .env PORT)
EXPOSE 5004

# Run the app
CMD ["node", "dist/index.js"]