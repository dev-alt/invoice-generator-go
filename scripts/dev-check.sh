#!/bin/bash

# Development Check Script - Checks status of all services

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "Development Services Status"
echo -e "==========================================${NC}"
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Check PostgreSQL
echo -e "${BLUE}PostgreSQL:${NC}"
if sudo service postgresql status | grep -q "online"; then
    echo -e "  Status: ${GREEN}✓ Running${NC}"
    if command -v psql &> /dev/null; then
        # Check if we can connect
        if PGPASSWORD=dev_password psql -U invoice_user -d invoice_db -h localhost -c '\q' 2>/dev/null; then
            echo -e "  Connection: ${GREEN}✓ Connected${NC}"
        else
            echo -e "  Connection: ${RED}✗ Cannot connect${NC}"
        fi
    fi
else
    echo -e "  Status: ${RED}✗ Not running${NC}"
fi
echo ""

# Check Redis
echo -e "${BLUE}Redis:${NC}"
if sudo service redis-server status | grep -q "running"; then
    echo -e "  Status: ${GREEN}✓ Running${NC}"
    if redis-cli ping 2>/dev/null | grep -q "PONG"; then
        echo -e "  Connection: ${GREEN}✓ Connected${NC}"
    else
        echo -e "  Connection: ${RED}✗ Cannot connect${NC}"
    fi
else
    echo -e "  Status: ${RED}✗ Not running${NC}"
fi
echo ""

# Check Backend
echo -e "${BLUE}Backend API (Port 8080):${NC}"
if [ -f "$PROJECT_ROOT/logs/backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_ROOT/logs/backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "  Status: ${GREEN}✓ Running (PID: $BACKEND_PID)${NC}"
        
        # Check if responding
        if curl -s http://localhost:8080/health > /dev/null 2>&1; then
            echo -e "  Health: ${GREEN}✓ Responding${NC}"
            echo "  URL: http://localhost:8080"
        else
            echo -e "  Health: ${YELLOW}⚠ Not responding${NC}"
        fi
    else
        echo -e "  Status: ${RED}✗ Not running (stale PID)${NC}"
    fi
else
    if lsof -ti:8080 > /dev/null 2>&1; then
        echo -e "  Status: ${YELLOW}⚠ Port in use (unknown process)${NC}"
    else
        echo -e "  Status: ${RED}✗ Not running${NC}"
    fi
fi
echo ""

# Check Frontend
echo -e "${BLUE}Frontend (Port 3000):${NC}"
if [ -f "$PROJECT_ROOT/logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PROJECT_ROOT/logs/frontend.pid")
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "  Status: ${GREEN}✓ Running (PID: $FRONTEND_PID)${NC}"
        
        # Check if responding
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e "  Health: ${GREEN}✓ Responding${NC}"
            echo "  URL: http://localhost:3000"
        else
            echo -e "  Health: ${YELLOW}⚠ Not responding (still starting?)${NC}"
        fi
    else
        echo -e "  Status: ${RED}✗ Not running (stale PID)${NC}"
    fi
else
    if lsof -ti:3000 > /dev/null 2>&1; then
        echo -e "  Status: ${YELLOW}⚠ Port in use (unknown process)${NC}"
    else
        echo -e "  Status: ${RED}✗ Not running${NC}"
    fi
fi
echo ""

# Check log files
echo -e "${BLUE}Logs:${NC}"
if [ -f "$PROJECT_ROOT/logs/backend.log" ]; then
    BACKEND_LOG_SIZE=$(du -h "$PROJECT_ROOT/logs/backend.log" | cut -f1)
    echo "  Backend: logs/backend.log ($BACKEND_LOG_SIZE)"
else
    echo -e "  Backend: ${YELLOW}No log file${NC}"
fi

if [ -f "$PROJECT_ROOT/logs/frontend.log" ]; then
    FRONTEND_LOG_SIZE=$(du -h "$PROJECT_ROOT/logs/frontend.log" | cut -f1)
    echo "  Frontend: logs/frontend.log ($FRONTEND_LOG_SIZE)"
else
    echo -e "  Frontend: ${YELLOW}No log file${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}=========================================="
echo "Quick Commands"
echo -e "==========================================${NC}"
echo "  Start:   ./scripts/dev-start.sh"
echo "  Stop:    ./scripts/dev-stop.sh"
echo "  Restart: ./scripts/dev-restart.sh"
echo ""
echo "  View Backend Logs:  tail -f logs/backend.log"
echo "  View Frontend Logs: tail -f logs/frontend.log"
echo ""
