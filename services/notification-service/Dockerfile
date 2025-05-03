# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy TypeScript config and source files
COPY tsconfig.json ./
COPY src ./src

# Expose the service port
EXPOSE 5004

# Default command: run in development mode with live-reload.
# In production, you could build and run the compiled JS instead.
CMD ["npm", "run", "dev"]
