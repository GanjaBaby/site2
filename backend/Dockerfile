# Use a slim Node.js image for build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if using)
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --production

# Create a new layer for the runtime image (smaller)
FROM node:18-alpine

# Copy only the necessary files for runtime
COPY --from=builder /app/node_modules /app/node_modules
COPY . .

# Expose port (adjust if needed)
EXPOSE 3000

# Start the server (replace with your actual entry point if different)
CMD [ "node", "server.js" ]
