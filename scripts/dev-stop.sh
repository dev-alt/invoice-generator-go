#!/bin/bash

# Development Stop Script - Stops all development services

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Stopping development services..."
echo "----------------------------------------"

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Stop Backend
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend stopped (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${YELLOW}⚠ Backend not running${NC}"
    fi
    rm -f logs/backend.pid
else
    echo -e "${YELLOW}⚠ No backend PID file found${NC}"
fi

# Stop Frontend
if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend stopped (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${YELLOW}⚠ Frontend not running${NC}"
    fi
    rm -f logs/frontend.pid
else
    echo -e "${YELLOW}⚠ No frontend PID file found${NC}"
fi

# Kill any remaining node/go processes on the ports
echo ""
echo "Cleaning up any remaining processes..."

# Kill processes on port 8080 (backend)
if lsof -ti:8080 > /dev/null 2>&1; then
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ Cleaned up port 8080${NC}"
fi

# Kill processes on port 3000 (frontend)
if lsof -ti:3000 > /dev/null 2>&1; then
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ Cleaned up port 3000${NC}"
fi

echo ""
echo -e "${GREEN}All development services stopped${NC}"
echo ""
echo "Note: PostgreSQL and Redis are still running."
echo "To stop them, run:"
echo "  sudo service postgresql stop"
echo "  sudo service redis-server stop"
echo ""
