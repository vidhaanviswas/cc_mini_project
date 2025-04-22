FROM node:16-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./

RUN npm install

# Install wait-for-it properly
RUN apk add --no-cache bash curl && \
    curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

COPY . .
COPY src/models ./src/models

# Create non-root user
RUN adduser -D appuser && \
    chown -R appuser /app
USER appuser

EXPOSE 5000

# Wait for MySQL to be ready before starting
CMD ["sh", "-c", "wait-for-it.sh mysql:3306 --timeout=30 -- npm start"]