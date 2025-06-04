# Build stage
FROM node:20 AS builder
WORKDIR /app
# Copy all files to ensure public and src are available
COPY . .
RUN npm ci
RUN npm run build

# Production stage
FROM node:20
WORKDIR /app
# Install serve globally
RUN npm install -g serve
# Copy the dist folder from the builder stage
COPY --from=builder /app/dist ./dist
# Set the port environment variable
ENV PORT=8080
# Expose the port
EXPOSE $PORT
# Run serve to serve the dist folder
CMD ["sh", "-c", "serve -s dist -l $PORT"]
