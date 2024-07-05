# Use an official Node.js runtime as a parent image
FROM node:20.11-alpine3.19 AS base

# Set the working directory
WORKDIR /app

RUN yarn config set registry https://registry.npmmirror.com

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn build

# Use a minimal Node.js image to serve the app
FROM node:20.11-alpine3.19 AS runner

# Set the working directory
WORKDIR /app

# Copy the built application and node_modules from the builder stage
COPY --from=base /app/.next /app/.next
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/package.json /app/package.json

# Expose port 3000
EXPOSE 3000

RUN yarn install

# Start the Next.js application
CMD ["yarn", "start"]
