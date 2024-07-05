# Use the pre-built base image
FROM igorwang/chatapp:v1.0base as builder

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . .

# Build the Next.js application
RUN yarn build

# Use a minimal Node.js image to serve the app
FROM node:20.11-alpine3.19 AS runner

# Set the working directory
WORKDIR /app

# Copy the built application and node_modules from the builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]
