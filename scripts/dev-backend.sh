#!/bin/bash

# Start Backend Only - For development

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting Backend API...${NC}"

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Load environment variables
if [ -f .env.development ]; then
    export $(grep -v '^#' .env.development | xargs)
fi

# Ensure PostgreSQL and Redis are running
echo "Checking services..."
sudo service postgresql start 2>/dev/null || true
sudo service redis-server start 2>/dev/null || true

# Start backend
cd invoice-generator-backend

echo ""
echo -e "${GREEN}Backend running at: http://localhost:8080${NC}"
echo "Press Ctrl+C to stop"
echo ""

go run ./cmd
