FROM node:16-alpine

WORKDIR /app

# Install docker-cli and dependencies
RUN apk add --no-cache docker-cli

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install axios express dockerode body-parser --legacy-peer-deps

COPY . .

# Create non-root user (without docker group)
RUN adduser -D appuser && \
    chown -R appuser /app
USER appuser

EXPOSE 5001

CMD ["node", "src/server.js"]