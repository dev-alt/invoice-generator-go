# Dockerfile
FROM golang:1.23-bullseye as builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum for dependency caching
COPY go.mod go.sum ./

# Download Go modules
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go application (statically linked)
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o invoice-generator ./cmd

# Start a new stage from scratch
FROM debian:bullseye-slim

# Install required dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wkhtmltopdf \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create storage directory
RUN mkdir -p /app/storage/files

# Copy the built executable
COPY --from=builder /app/invoice-generator .

# Expose port
EXPOSE 8080

# Command to run the application
CMD ["./invoice-generator"]