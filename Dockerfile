# Use an official Node.js runtime as a parent image
FROM igorwang/chatapp:v1.0base as builder

WORKDIR /app

COPY . .
# Set the working directory
RUN  yarn build
# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]
