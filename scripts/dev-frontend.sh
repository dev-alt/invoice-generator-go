#!/bin/bash

# Start Frontend Only - For development

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting Frontend...${NC}"

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Load environment variables
if [ -f .env.development ]; then
    export $(grep -v '^#' .env.development | xargs)
fi

# Start frontend
cd invoice-generator-frontend

echo ""
echo -e "${GREEN}Frontend running at: http://localhost:3000${NC}"
echo "Press Ctrl+C to stop"
echo ""

npm run dev
