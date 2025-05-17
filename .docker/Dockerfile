# Base image for Node.js 20
FROM node:20-alpine3.20

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY ../package*.json ../tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the entire app source code
COPY ../ ./

# Build the TypeScript code
RUN npm run build

# Expose port
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/src/mains"]
