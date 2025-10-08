# 🎉 Development Scripts Created!

I've created comprehensive development scripts to run your Invoice Generator locally on WSL!

## 📦 What Was Created

### 🔧 Configuration Files
- ✅ `.env.development` - Development environment variables
- ✅ `.gitignore` - Ignore logs, env files, and build artifacts

### 📜 Bash Scripts (WSL)
All scripts are in the `scripts/` directory:

- ✅ `dev-setup.sh` - One-time setup (installs PostgreSQL, Redis, Node, Go, etc.)
- ✅ `dev-start.sh` - Start all services (backend, frontend, DB, Redis)
- ✅ `dev-stop.sh` - Stop all services
- ✅ `dev-restart.sh` - Restart all services
- ✅ `dev-check.sh` - Check status of all services
- ✅ `dev-logs.sh` - Interactive log viewer
- ✅ `dev-backend.sh` - Start backend only (foreground)
- ✅ `dev-frontend.sh` - Start frontend only (foreground)

### 💻 PowerShell Wrapper (Windows)
- ✅ `dev.ps1` - Easy-to-use PowerShell commands for Windows

### 📚 Documentation
- ✅ `DEV_README.md` - Complete local development guide
- ✅ `QUICK_START.md` - Quick start guide for local dev
- ✅ `SCRIPTS_REFERENCE.md` - Detailed script documentation
- ✅ `README.md` - Updated main README with both Docker and Local options

## 🚀 How to Use

### From Windows PowerShell:

```powershell
# Navigate to project
cd \\wsl.localhost\Ubuntu-22.04\root\projects\invoice-generator-go

# First time setup (installs everything)
.\dev.ps1 setup

# Start development
.\dev.ps1 start

# Check if everything is running
.\dev.ps1 check

# View logs
.\dev.ps1 logs

# Stop when done
.\dev.ps1 stop
```

### From WSL Terminal:

```bash
# Navigate to project
cd /root/projects/invoice-generator-go

# Make scripts executable
chmod +x scripts/*.sh

# First time setup
./scripts/dev-setup.sh

# Start development
./scripts/dev-start.sh

# Check status
./scripts/dev-check.sh

# View logs
./scripts/dev-logs.sh

# Stop services
./scripts/dev-stop.sh
```

## 🎯 What Gets Installed

The setup script automatically installs:

- ✅ **PostgreSQL 15** - Database
- ✅ **Redis 7** - Caching
- ✅ **Node.js 20** - Frontend runtime
- ✅ **Go 1.23** - Backend language
- ✅ **golang-migrate** - Database migrations
- ✅ **wkhtmltopdf** - PDF generation

## 🌐 Access Points

After running `start`, you can access:

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:3000 | 3000 |
| **Backend API** | http://localhost:8080 | 8080 |
| **PostgreSQL** | localhost | 5432 |
| **Redis** | localhost | 6379 |

## 📋 Development Workflow

### Typical Day:

```bash
# Morning - Start everything
./scripts/dev-start.sh

# Check everything is running
./scripts/dev-check.sh

# Work on your code...
# Frontend auto-reloads on changes
# Backend needs restart after Go changes

# View logs if needed
./scripts/dev-logs.sh

# Evening - Stop everything
./scripts/dev-stop.sh
```

### Backend Development:

```bash
# Terminal 1: Run backend in foreground
./scripts/dev-backend.sh

# Make changes, press Ctrl+C, restart
# Or restart in another terminal:
./scripts/dev-restart.sh
```

### Frontend Development:

```bash
# Just start normally - it auto-reloads
./scripts/dev-start.sh

# Or run in foreground:
./scripts/dev-frontend.sh
```

## 🔍 Useful Commands

### Check Service Status
```bash
./scripts/dev-check.sh
```

### View Logs
```bash
# Interactive menu
./scripts/dev-logs.sh

# Or directly
tail -f logs/backend.log
tail -f logs/frontend.log
```

### Access Database
```bash
psql -U invoice_user -d invoice_db -h localhost
# Password: dev_password
```

### Access Redis
```bash
redis-cli
```

### Restart Services
```bash
./scripts/dev-restart.sh
```

## 🐛 Troubleshooting

### Services not starting?
```bash
# Check status
./scripts/dev-check.sh

# View logs
./scripts/dev-logs.sh

# Restart
./scripts/dev-restart.sh
```

### Port conflicts?
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Then restart
./scripts/dev-start.sh
```

### Database issues?
```bash
# Reset database
sudo -u postgres psql -c "DROP DATABASE invoice_db;"
sudo -u postgres psql -c "DROP USER invoice_user;"

# Run setup again
./scripts/dev-setup.sh
```

### Start fresh
```bash
# Stop everything
./scripts/dev-stop.sh
sudo service postgresql stop
sudo service redis-server stop

# Clear logs
rm -f logs/*.log logs/*.pid

# Start again
./scripts/dev-start.sh
```

## 📖 Documentation

| Document | What's Inside |
|----------|---------------|
| **DEV_README.md** | Complete local development guide with all details |
| **QUICK_START.md** | Quick reference for common commands |
| **SCRIPTS_REFERENCE.md** | Detailed documentation of each script |
| **README.md** | Main README with both Docker and Local options |

## 🎊 You're All Set!

Now you can develop locally without Docker! Just run:

```bash
# Windows PowerShell
.\dev.ps1 setup
.\dev.ps1 start

# Or WSL
./scripts/dev-setup.sh
./scripts/dev-start.sh
```

Then open http://localhost:3000 and start coding! 🚀

## 💡 Pro Tips

1. **First time?** Run setup: `./scripts/dev-setup.sh`
2. **Check often:** Use `./scripts/dev-check.sh` to see status
3. **Watch logs:** Use `./scripts/dev-logs.sh` for debugging
4. **Backend changes?** Restart: `./scripts/dev-restart.sh`
5. **Frontend changes?** They auto-reload! ✨

## 🆚 Docker vs Local

### Use Local Development When:
- ✅ You want faster iteration
- ✅ You need direct debugging access
- ✅ You want to save system resources
- ✅ You prefer working with services directly

### Use Docker When:
- ✅ You want production-like environment
- ✅ You need consistent team setup
- ✅ You're testing deployment
- ✅ You want isolated services

## 🎯 Next Steps

1. ✅ Run `.\dev.ps1 setup` or `./scripts/dev-setup.sh`
2. ✅ Run `.\dev.ps1 start` or `./scripts/dev-start.sh`
3. ✅ Open http://localhost:3000
4. 🎉 Start building amazing features!

Happy coding! 🚀
