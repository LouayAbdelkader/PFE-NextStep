# Use a slim base image to reduce vulnerabilities
FROM node:18-slim AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies securely
RUN npm install --production --ignore-scripts && \
    npm audit fix --production || true && \
    apt-get update && apt-get upgrade -y && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Final stage for runtime
FROM node:18-slim

WORKDIR /usr/src/app

# Copy only necessary files from builder
COPY --from=builder /usr/src/app /usr/src/app

# Create a non-root user and switch to it
RUN useradd -m appuser && chown -R appuser:appuser /usr/src/app
USER appuser

# Expose port
EXPOSE 8002

# Set environment variable
ENV NODE_ENV=production

# Run the app
CMD ["node", "index.js"]
