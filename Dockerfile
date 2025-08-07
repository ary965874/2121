# Use Bun official base image
FROM oven/bun

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN bun install

# Expose the port used in your Bun app
EXPOSE 8080

# Run the app
CMD ["bun", "index.ts"]
