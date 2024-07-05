# Use an official Node.js runtime as a parent image
FROM igorwang/chatapp:v1.0base 

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn build

# Set the working directory
# WORKDIR /app

# Copy the built application from the builder stage
# COPY --from=builder /app/.next /app/.next
# COPY --from=builder /app/node_modules /app/node_modules
# COPY --from=builder /app/package.json /app/package.json

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]
