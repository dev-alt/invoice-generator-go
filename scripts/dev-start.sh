#!/bin/bash

# Development Start Script - Starts all services in development mode
# This script starts PostgreSQL, Redis, Backend, and Frontend

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "Invoice Generator - Development Mode"
echo -e "==========================================${NC}"
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Load environment variables
if [ -f .env.development ]; then
    export $(grep -v '^#' .env.development | xargs)
    echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
    echo -e "${YELLOW}⚠ .env.development not found, using defaults${NC}"
fi

# Check if services are installed
echo ""
echo "Checking services..."
echo "----------------------------------------"

if ! command -v psql &> /dev/null; then
    echo -e "${RED}✗ PostgreSQL not found. Run ./scripts/dev-setup.sh first${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL installed${NC}"

if ! command -v redis-cli &> /dev/null; then
    echo -e "${RED}✗ Redis not found. Run ./scripts/dev-setup.sh first${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Redis installed${NC}"

if ! command -v go &> /dev/null; then
    echo -e "${RED}✗ Go not found. Run ./scripts/dev-setup.sh first${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Go installed${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Run ./scripts/dev-setup.sh first${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installed${NC}"

echo ""
echo "Starting services..."
echo "----------------------------------------"

# Start PostgreSQL
echo "Starting PostgreSQL..."
sudo service postgresql start
sleep 2
if sudo service postgresql status | grep -q "online"; then
    echo -e "${GREEN}✓ PostgreSQL running${NC}"
else
    echo -e "${RED}✗ PostgreSQL failed to start${NC}"
    exit 1
fi

# Start Redis
echo "Starting Redis..."
sudo service redis-server start
sleep 2
if redis-cli ping | grep -q "PONG"; then
    echo -e "${GREEN}✓ Redis running${NC}"
else
    echo -e "${RED}✗ Redis failed to start${NC}"
    exit 1
fi

# Create log directory
mkdir -p "$PROJECT_ROOT/logs"

echo ""
echo "Starting application services..."
echo "----------------------------------------"

# Start Backend in background
echo "Starting Backend API..."
cd "$PROJECT_ROOT/invoice-generator-backend"
nohup go run ./cmd > "$PROJECT_ROOT/logs/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$PROJECT_ROOT/logs/backend.pid"
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "  Log: $PROJECT_ROOT/logs/backend.log"

# Wait for backend to start
echo "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Backend failed to start. Check logs/backend.log${NC}"
        exit 1
    fi
    sleep 1
done

# Start Frontend in background
echo "Starting Frontend..."
cd "$PROJECT_ROOT/invoice-generator-frontend"
nohup npm run dev > "$PROJECT_ROOT/logs/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$PROJECT_ROOT/logs/frontend.pid"
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "  Log: $PROJECT_ROOT/logs/frontend.log"

# Wait for frontend to start
echo "Waiting for frontend to be ready..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${YELLOW}⚠ Frontend taking longer than expected. Check logs/frontend.log${NC}"
    fi
    sleep 1
done

cd "$PROJECT_ROOT"

echo ""
echo -e "${BLUE}=========================================="
echo "Development Environment Ready!"
echo -e "==========================================${NC}"
echo ""
echo -e "${GREEN}Services:${NC}"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:8080"
echo "  Database:  localhost:5432"
echo "  Redis:     localhost:6379"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo "  Backend:   tail -f logs/backend.log"
echo "  Frontend:  tail -f logs/frontend.log"
echo ""
echo -e "${YELLOW}Commands:${NC}"
echo "  Stop all:  ./scripts/dev-stop.sh"
echo "  Check:     ./scripts/dev-check.sh"
echo "  Restart:   ./scripts/dev-restart.sh"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
