#!/bin/bash

# Development Environment Setup Script for WSL
# This script sets up PostgreSQL, Redis, and installs dependencies

set -e

echo "=========================================="
echo "Invoice Generator - Development Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env.development ]; then
    export $(grep -v '^#' .env.development | xargs)
fi

# Check if running on WSL
if ! grep -qi microsoft /proc/version; then
    echo -e "${YELLOW}Warning: This script is designed for WSL. Continue anyway? (y/n)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "Step 1: Checking system dependencies..."
echo "----------------------------------------"

# Check for sudo privileges
if ! sudo -n true 2>/dev/null; then
    echo "This script requires sudo privileges. Please enter your password."
    sudo -v
fi

# Update package list
echo "Updating package list..."
sudo apt-get update -qq

# Install PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}PostgreSQL not found. Installing...${NC}"
    sudo apt-get install -y postgresql postgresql-contrib
    echo -e "${GREEN}PostgreSQL installed${NC}"
else
    echo -e "${GREEN}PostgreSQL already installed${NC}"
fi

# Install Redis
if ! command -v redis-cli &> /dev/null; then
    echo -e "${YELLOW}Redis not found. Installing...${NC}"
    sudo apt-get install -y redis-server
    echo -e "${GREEN}Redis installed${NC}"
else
    echo -e "${GREEN}Redis already installed${NC}"
fi

# Install golang-migrate
if ! command -v migrate &> /dev/null; then
    echo -e "${YELLOW}golang-migrate not found. Installing...${NC}"
    curl -L https://github.com/golang-migrate/migrate/releases/download/v4.17.0/migrate.linux-amd64.tar.gz | tar xvz
    sudo mv migrate /usr/local/bin/
    sudo chmod +x /usr/local/bin/migrate
    echo -e "${GREEN}golang-migrate installed${NC}"
else
    echo -e "${GREEN}golang-migrate already installed${NC}"
fi

# Install wkhtmltopdf (for PDF generation)
if ! command -v wkhtmltopdf &> /dev/null; then
    echo -e "${YELLOW}wkhtmltopdf not found. Installing...${NC}"
    sudo apt-get install -y wkhtmltopdf
    echo -e "${GREEN}wkhtmltopdf installed${NC}"
else
    echo -e "${GREEN}wkhtmltopdf already installed${NC}"
fi

# Install Node.js (if not installed)
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing Node.js 20.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}Node.js installed${NC}"
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}Node.js already installed ($NODE_VERSION)${NC}"
fi

# Install Go (if not installed or version too old)
if ! command -v go &> /dev/null; then
    echo -e "${YELLOW}Go not found. Installing Go 1.23...${NC}"
    wget -q https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
    sudo rm -rf /usr/local/go
    sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
    rm go1.23.0.linux-amd64.tar.gz
    
    # Add Go to PATH if not already there
    if ! grep -q "/usr/local/go/bin" ~/.bashrc; then
        echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
        echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.bashrc
    fi
    
    export PATH=$PATH:/usr/local/go/bin
    echo -e "${GREEN}Go installed${NC}"
else
    GO_VERSION=$(go version)
    echo -e "${GREEN}Go already installed ($GO_VERSION)${NC}"
fi

echo ""
echo "Step 2: Starting and configuring services..."
echo "----------------------------------------"

# Start PostgreSQL
echo "Starting PostgreSQL..."
sudo service postgresql start
sleep 2

# Start Redis
echo "Starting Redis..."
sudo service redis-server start
sleep 2

echo ""
echo "Step 3: Setting up database..."
echo "----------------------------------------"

# Create database user and database
echo "Creating database user and database..."
sudo -u postgres psql -c "SELECT 1 FROM pg_user WHERE usename = '${DB_USER}';" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"

sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}';" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

echo -e "${GREEN}Database setup complete${NC}"

echo ""
echo "Step 4: Running database migrations..."
echo "----------------------------------------"

cd invoice-generator-backend

# Run migrations
if [ -d "migrations" ]; then
    migrate -database "${POSTGRES_URL}" -path migrations up
    echo -e "${GREEN}Migrations completed${NC}"
else
    echo -e "${YELLOW}No migrations directory found, skipping...${NC}"
fi

cd ..

echo ""
echo "Step 5: Installing backend dependencies..."
echo "----------------------------------------"

cd invoice-generator-backend
if [ -f "go.mod" ]; then
    echo "Installing Go modules..."
    go mod download
    go mod tidy
    echo -e "${GREEN}Backend dependencies installed${NC}"
fi
cd ..

echo ""
echo "Step 6: Installing frontend dependencies..."
echo "----------------------------------------"

cd invoice-generator-frontend
if [ -f "package.json" ]; then
    echo "Installing npm packages..."
    npm install
    echo -e "${GREEN}Frontend dependencies installed${NC}"
fi
cd ..

echo ""
echo "Step 7: Creating storage directories..."
echo "----------------------------------------"

mkdir -p invoice-generator-backend/storage/files
echo -e "${GREEN}Storage directories created${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "To start development, run:"
echo "  ./scripts/dev-start.sh"
echo ""
echo "Or start services individually:"
echo "  ./scripts/dev-backend.sh   # Start backend API"
echo "  ./scripts/dev-frontend.sh  # Start frontend"
echo "  ./scripts/dev-check.sh     # Check service status"
echo ""
