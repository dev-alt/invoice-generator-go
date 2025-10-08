# Development Scripts Summary

## Overview

This document provides a quick reference for all development scripts available in the Invoice Generator project.

## Script Locations

- **PowerShell**: `dev.ps1` (Windows)
- **Bash Scripts**: `scripts/` directory (WSL/Linux)

## PowerShell Commands (Windows)

Run from Windows PowerShell in the project root:

```powershell
.\dev.ps1 <command>
```

| Command | Description | Usage |
|---------|-------------|-------|
| `setup` | Install all dependencies and configure services | `.\dev.ps1 setup` |
| `start` | Start all services (backend, frontend, DB, Redis) | `.\dev.ps1 start` |
| `stop` | Stop all application services | `.\dev.ps1 stop` |
| `restart` | Restart all services | `.\dev.ps1 restart` |
| `check` | Check status of all services | `.\dev.ps1 check` |
| `logs` | View application logs interactively | `.\dev.ps1 logs` |
| `backend` | Start backend only (foreground) | `.\dev.ps1 backend` |
| `frontend` | Start frontend only (foreground) | `.\dev.ps1 frontend` |
| `help` | Show help message | `.\dev.ps1 help` |

## Bash Scripts (WSL/Linux)

Run from WSL terminal in the project root:

```bash
./scripts/<script-name>.sh
```

### Main Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `dev-setup.sh` | One-time setup - installs all dependencies | `./scripts/dev-setup.sh` |
| `dev-start.sh` | Start all services in background | `./scripts/dev-start.sh` |
| `dev-stop.sh` | Stop all services | `./scripts/dev-stop.sh` |
| `dev-restart.sh` | Restart all services | `./scripts/dev-restart.sh` |
| `dev-check.sh` | Check service health and status | `./scripts/dev-check.sh` |
| `dev-logs.sh` | Interactive log viewer | `./scripts/dev-logs.sh` |

### Individual Service Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `dev-backend.sh` | Start backend only (foreground) | `./scripts/dev-backend.sh` |
| `dev-frontend.sh` | Start frontend only (foreground) | `./scripts/dev-frontend.sh` |

## What Each Script Does

### Setup Script (`dev-setup.sh`)

**Purpose**: One-time installation and configuration

**Actions**:
1. Checks system dependencies
2. Installs PostgreSQL 15
3. Installs Redis 7
4. Installs Node.js 20
5. Installs Go 1.23
6. Installs golang-migrate
7. Installs wkhtmltopdf
8. Creates database and user
9. Runs database migrations
10. Installs backend dependencies (Go modules)
11. Installs frontend dependencies (npm packages)
12. Creates storage directories

**When to run**: Once when setting up the project, or after major system changes

### Start Script (`dev-start.sh`)

**Purpose**: Start all services for development

**Actions**:
1. Loads environment variables from `.env.development`
2. Starts PostgreSQL service
3. Starts Redis service
4. Starts backend API in background (port 8080)
5. Starts frontend in background (port 3000)
6. Creates log files for each service
7. Waits for services to be healthy

**Output**:
- Backend PID saved to `logs/backend.pid`
- Frontend PID saved to `logs/frontend.pid`
- Backend logs: `logs/backend.log`
- Frontend logs: `logs/frontend.log`

### Stop Script (`dev-stop.sh`)

**Purpose**: Stop all application services

**Actions**:
1. Reads PIDs from log files
2. Kills backend process
3. Kills frontend process
4. Cleans up any remaining processes on ports 8080 and 3000
5. Removes PID files

**Note**: Does not stop PostgreSQL or Redis (they remain running)

### Check Script (`dev-check.sh`)

**Purpose**: Display status of all services

**Output**:
- PostgreSQL status and connection test
- Redis status and connection test
- Backend API status and health check
- Frontend status and health check
- Log file information
- Quick command reference

### Restart Script (`dev-restart.sh`)

**Purpose**: Restart all services

**Actions**:
1. Runs `dev-stop.sh`
2. Waits 3 seconds
3. Runs `dev-start.sh`

### Logs Script (`dev-logs.sh`)

**Purpose**: Interactive log viewer

**Options**:
1. View backend logs only
2. View frontend logs only
3. View both side-by-side (requires multitail)
4. View both combined

### Backend Script (`dev-backend.sh`)

**Purpose**: Start backend only in foreground

**Usage**: For focused backend development or debugging

**Actions**:
1. Loads environment variables
2. Ensures PostgreSQL and Redis are running
3. Runs `go run ./cmd` in foreground

**Stop**: Ctrl+C

### Frontend Script (`dev-frontend.sh`)

**Purpose**: Start frontend only in foreground

**Usage**: For focused frontend development

**Actions**:
1. Loads environment variables
2. Runs `npm run dev` in foreground

**Stop**: Ctrl+C

## Environment Variables

Scripts use variables from `.env.development`:

```bash
# Database
POSTGRES_URL=postgresql://invoice_user:dev_password@localhost:5432/invoice_db?sslmode=disable
DB_USER=invoice_user
DB_PASSWORD=dev_password
DB_NAME=invoice_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev-jwt-secret-change-in-production

# Storage
FILE_STORAGE_PATH=./storage/files

# Ports
API_PORT=8080
NEXT_PORT=3000
```

## Log Files

All log files are stored in the `logs/` directory:

| File | Content |
|------|---------|
| `backend.log` | Backend API logs (stdout/stderr) |
| `frontend.log` | Frontend Next.js logs (stdout/stderr) |
| `backend.pid` | Backend process ID |
| `frontend.pid` | Frontend process ID |

### View Logs

```bash
# Real-time backend logs
tail -f logs/backend.log

# Real-time frontend logs
tail -f logs/frontend.log

# Both logs
tail -f logs/*.log

# Last 100 lines
tail -n 100 logs/backend.log
```

## Common Workflows

### Initial Setup

```bash
# First time only
./scripts/dev-setup.sh
```

### Daily Development

```bash
# Start your day
./scripts/dev-start.sh

# Check everything is running
./scripts/dev-check.sh

# Work on your code...

# End of day
./scripts/dev-stop.sh
```

### Troubleshooting

```bash
# Check what's wrong
./scripts/dev-check.sh

# View logs
./scripts/dev-logs.sh

# Restart everything
./scripts/dev-restart.sh
```

### Backend Development Focus

```bash
# Terminal 1: Run backend in foreground
./scripts/dev-backend.sh

# Terminal 2: Watch logs
tail -f logs/backend.log

# Make changes, Ctrl+C to stop, restart
```

### Frontend Development Focus

```bash
# Terminal 1: Run frontend in foreground
./scripts/dev-frontend.sh

# Changes auto-reload
# Ctrl+C to stop
```

## Service Management

### PostgreSQL

```bash
# Start
sudo service postgresql start

# Stop
sudo service postgresql stop

# Status
sudo service postgresql status

# Restart
sudo service postgresql restart

# Access
psql -U invoice_user -d invoice_db -h localhost
```

### Redis

```bash
# Start
sudo service redis-server start

# Stop
sudo service redis-server stop

# Status
sudo service redis-server status

# Access
redis-cli
```

## Troubleshooting Scripts

### Port in Use

```bash
# Check port
lsof -i :8080
lsof -i :3000

# Kill process
lsof -ti:8080 | xargs kill -9
```

### Clean Start

```bash
# Stop everything
./scripts/dev-stop.sh
sudo service postgresql stop
sudo service redis-server stop

# Clear logs
rm -f logs/*.log logs/*.pid

# Start fresh
./scripts/dev-start.sh
```

### Reset Database

```bash
# Drop and recreate
sudo -u postgres psql -c "DROP DATABASE invoice_db;"
sudo -u postgres psql -c "DROP USER invoice_user;"

# Run setup
./scripts/dev-setup.sh
```

## Script Permissions

If scripts aren't executable:

```bash
# Make all scripts executable
chmod +x scripts/*.sh
chmod +x dev.ps1
```

## Dependencies Between Scripts

```
dev-setup.sh (run once)
    ↓
dev-start.sh (uses .env.development)
    ↓
dev-check.sh (monitors services)
    ↓
dev-stop.sh (cleanup)
    ↓
dev-restart.sh (combines stop + start)
```

Individual scripts:
- `dev-backend.sh` - Independent
- `dev-frontend.sh` - Independent
- `dev-logs.sh` - Reads from logs/

## Best Practices

1. **Always run setup first**: `./scripts/dev-setup.sh`
2. **Check status regularly**: `./scripts/dev-check.sh`
3. **View logs when debugging**: `./scripts/dev-logs.sh`
4. **Stop services when done**: `./scripts/dev-stop.sh`
5. **Use individual scripts for focused work**: `dev-backend.sh` or `dev-frontend.sh`

## Quick Reference Card

```bash
# Setup (once)
./scripts/dev-setup.sh

# Daily use
./scripts/dev-start.sh      # Start work
./scripts/dev-check.sh      # Status check
./scripts/dev-logs.sh       # View logs
./scripts/dev-stop.sh       # End work

# Maintenance
./scripts/dev-restart.sh    # Restart all

# Focused development
./scripts/dev-backend.sh    # Backend only
./scripts/dev-frontend.sh   # Frontend only
```

## From PowerShell

```powershell
# Setup (once)
.\dev.ps1 setup

# Daily use
.\dev.ps1 start      # Start work
.\dev.ps1 check      # Status check
.\dev.ps1 logs       # View logs
.\dev.ps1 stop       # End work

# Maintenance
.\dev.ps1 restart    # Restart all

# Focused development
.\dev.ps1 backend    # Backend only
.\dev.ps1 frontend   # Frontend only
```
