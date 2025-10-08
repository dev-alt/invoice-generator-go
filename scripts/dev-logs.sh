#!/bin/bash

# View Development Logs

# Colors
BLUE='\033[0;34m'
NC='\033[0m'

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}=========================================="
echo "Development Logs"
echo -e "==========================================${NC}"
echo ""
echo "Choose which logs to view:"
echo "  1) Backend"
echo "  2) Frontend"
echo "  3) Both (side by side)"
echo "  4) Both (combined)"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo -e "\n${BLUE}Backend Logs:${NC}"
        tail -f "$PROJECT_ROOT/logs/backend.log"
        ;;
    2)
        echo -e "\n${BLUE}Frontend Logs:${NC}"
        tail -f "$PROJECT_ROOT/logs/frontend.log"
        ;;
    3)
        # Side by side using multitail if available
        if command -v multitail &> /dev/null; then
            multitail "$PROJECT_ROOT/logs/backend.log" "$PROJECT_ROOT/logs/frontend.log"
        else
            echo "multitail not installed. Install with: sudo apt-get install multitail"
            echo "Falling back to combined view..."
            tail -f "$PROJECT_ROOT/logs/backend.log" "$PROJECT_ROOT/logs/frontend.log"
        fi
        ;;
    4)
        echo -e "\n${BLUE}Combined Logs:${NC}"
        tail -f "$PROJECT_ROOT/logs/backend.log" "$PROJECT_ROOT/logs/frontend.log"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
