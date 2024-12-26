# Start from the official Golang image
FROM golang:1.21 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum for dependency caching
COPY go.mod go.sum ./

# Download Go modules
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go application
RUN go build -o invoice-generator ./cmd

# Start a new stage from a smaller base image (for a smaller final image size)
FROM debian:bullseye-slim

# Install wkhtmltopdf (required for PDF generation)
RUN apt-get update && apt-get install -y --no-install-recommends wkhtmltopdf

# Set working directory for the final image
WORKDIR /app

# Copy the built executable from the builder stage
COPY --from=builder /app/invoice-generator .

# Copy the .env.example (optional - if you want to include it in the image)
# COPY --from=builder /app/.env.example .

# Expose the port your application listens on (8080 in this case)
EXPOSE 8080

# Command to run the application
CMD ["./invoice-generator"]