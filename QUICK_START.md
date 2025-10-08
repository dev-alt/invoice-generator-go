# Getting Started - Local Development (WSL)

Quick guide to start developing locally on WSL.

## Prerequisites

- Windows with WSL2 installed
- Ubuntu 22.04 (or similar) on WSL

## Quick Start

### From Windows PowerShell:

```powershell
# Navigate to project
cd \\wsl.localhost\Ubuntu-22.04\root\projects\invoice-generator-go

# One-time setup
.\dev.ps1 setup

# Start development
.\dev.ps1 start

# Check status
.\dev.ps1 check

# View logs
.\dev.ps1 logs

# Stop services
.\dev.ps1 stop
```

### From WSL Terminal:

```bash
# Navigate to project
cd /root/projects/invoice-generator-go

# One-time setup
./scripts/dev-setup.sh

# Start development
./scripts/dev-start.sh

# Check status
./scripts/dev-check.sh

# Stop services
./scripts/dev-stop.sh
```

## What Gets Installed?

The setup script automatically installs:
- ✅ PostgreSQL 15
- ✅ Redis 7
- ✅ Node.js 20
- ✅ Go 1.23
- ✅ golang-migrate
- ✅ wkhtmltopdf (for PDF generation)

## Access Points

After running `dev.ps1 start` or `./scripts/dev-start.sh`:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Available Commands (PowerShell)

| Command | Description |
|---------|-------------|
| `.\dev.ps1 setup` | Install all dependencies |
| `.\dev.ps1 start` | Start all services |
| `.\dev.ps1 stop` | Stop all services |
| `.\dev.ps1 restart` | Restart services |
| `.\dev.ps1 check` | Check service status |
| `.\dev.ps1 logs` | View logs |
| `.\dev.ps1 backend` | Start backend only |
| `.\dev.ps1 frontend` | Start frontend only |
| `.\dev.ps1 help` | Show help |

## Available Commands (WSL Bash)

All scripts are in the `scripts/` directory:

| Script | Description |
|--------|-------------|
| `dev-setup.sh` | Install all dependencies |
| `dev-start.sh` | Start all services |
| `dev-stop.sh` | Stop all services |
| `dev-restart.sh` | Restart services |
| `dev-check.sh` | Check service status |
| `dev-logs.sh` | View logs |
| `dev-backend.sh` | Start backend only |
| `dev-frontend.sh` | Start frontend only |

## Typical Workflow

```powershell
# Day 1 - Setup
.\dev.ps1 setup

# Every day - Start working
.\dev.ps1 start

# During work - Check if everything is running
.\dev.ps1 check

# During work - View logs if needed
.\dev.ps1 logs

# End of day - Stop services
.\dev.ps1 stop
```

## Troubleshooting

### Services not starting?

```powershell
# Check status
.\dev.ps1 check

# View logs
.\dev.ps1 logs

# Restart
.\dev.ps1 restart
```

### Port conflicts?

Kill the process using the port:

```powershell
# PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or from WSL
wsl lsof -ti:3000 | xargs kill -9
```

### Database issues?

```powershell
# From WSL, recreate the database
wsl sudo -u postgres psql -c "DROP DATABASE invoice_db;"
wsl sudo -u postgres psql -c "DROP USER invoice_user;"

# Run setup again
.\dev.ps1 setup
```

## More Information

For detailed documentation, see:
- **DEV_README.md** - Complete local development guide
- **README.docker.md** - Docker deployment guide

## Need Help?

```powershell
# Check service status
.\dev.ps1 check

# View help
.\dev.ps1 help
```

## Next Steps

1. ✅ Run `.\dev.ps1 setup` (one-time)
2. ✅ Run `.\dev.ps1 start`
3. ✅ Open http://localhost:3000
4. 🚀 Start coding!
