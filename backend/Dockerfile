FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
# Using npm install instead of npm ci for better compatibility
# npm ci requires exact sync between package.json and package-lock.json
# npm install works even if package-lock.json is missing or slightly out of sync
RUN npm install --omit=dev

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]

