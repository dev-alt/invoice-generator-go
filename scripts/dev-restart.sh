#!/bin/bash

# Development Restart Script - Restarts all services

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "Restarting Development Environment"
echo -e "==========================================${NC}"
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Stop services
echo "Stopping services..."
./scripts/dev-stop.sh

echo ""
echo "Waiting 3 seconds..."
sleep 3

# Start services
echo ""
echo "Starting services..."
./scripts/dev-start.sh
