# Local Development Guide (WSL)

This guide explains how to run the Invoice Generator application locally on WSL without Docker.

## Prerequisites

- WSL2 (Ubuntu 22.04 or similar)
- Bash shell
- Sudo privileges

All other dependencies (PostgreSQL, Redis, Node.js, Go) will be installed by the setup script.

## Quick Start

### 1. Initial Setup (One-time)

Run the setup script to install all dependencies and configure services:

```bash
chmod +x scripts/*.sh
./scripts/dev-setup.sh
```

This script will:
- Install PostgreSQL, Redis, Node.js, Go, and other dependencies
- Create the database and user
- Run database migrations
- Install npm and Go packages
- Set up storage directories

**Note:** You'll need to enter your sudo password during setup.

### 2. Start Development Environment

```bash
./scripts/dev-start.sh
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 8080)
- Frontend (port 3000)

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## Available Scripts

### Main Scripts

| Script | Description |
|--------|-------------|
| `./scripts/dev-setup.sh` | One-time setup - installs dependencies |
| `./scripts/dev-start.sh` | Start all services (backend, frontend, db, redis) |
| `./scripts/dev-stop.sh` | Stop all services |
| `./scripts/dev-restart.sh` | Restart all services |
| `./scripts/dev-check.sh` | Check status of all services |
| `./scripts/dev-logs.sh` | View application logs |

### Individual Service Scripts

| Script | Description |
|--------|-------------|
| `./scripts/dev-backend.sh` | Start backend only (foreground) |
| `./scripts/dev-frontend.sh` | Start frontend only (foreground) |

## Development Workflow

### Starting Work

```bash
# Start everything
./scripts/dev-start.sh

# Check status
./scripts/dev-check.sh
```

### During Development

```bash
# View logs
tail -f logs/backend.log
tail -f logs/frontend.log

# Or use the log viewer
./scripts/dev-logs.sh

# Check service status
./scripts/dev-check.sh
```

### Stopping Work

```bash
# Stop application services
./scripts/dev-stop.sh

# Optionally stop database services
sudo service postgresql stop
sudo service redis-server stop
```

### Making Changes

**Backend Changes:**
- Edit Go files in `invoice-generator-backend/`
- Restart backend: `./scripts/dev-restart.sh`
- Or manually: Stop and run `./scripts/dev-backend.sh`

**Frontend Changes:**
- Edit files in `invoice-generator-frontend/`
- Changes are automatically detected (hot reload)
- If needed, restart: `./scripts/dev-restart.sh`

**Database Changes:**
- Add new migration files in `invoice-generator-backend/migrations/`
- Run migrations: `cd invoice-generator-backend && migrate -database "$POSTGRES_URL" -path migrations up`

## Environment Configuration

The development environment uses `.env.development` with these settings:

```bash
# Database
POSTGRES_URL=postgresql://invoice_user:dev_password@localhost:5432/invoice_db?sslmode=disable

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev-jwt-secret-change-in-production

# Ports
API_PORT=8080
NEXT_PORT=3000
```

You can modify these values in `.env.development` and restart services.

## Service Details

### PostgreSQL
- **Port**: 5432
- **User**: invoice_user
- **Password**: dev_password (configurable in `.env.development`)
- **Database**: invoice_db

**Access database:**
```bash
psql -U invoice_user -d invoice_db -h localhost
# Password: dev_password
```

### Redis
- **Port**: 6379
- **No password** in development

**Access Redis:**
```bash
redis-cli
```

### Backend API
- **Port**: 8080
- **Language**: Go 1.23
- **Hot Reload**: Manual restart required

**Run directly:**
```bash
cd invoice-generator-backend
go run ./cmd
```

### Frontend
- **Port**: 3000
- **Framework**: Next.js 15
- **Hot Reload**: Automatic

**Run directly:**
```bash
cd invoice-generator-frontend
npm run dev
```

## Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

```bash
# Check what's using the port
lsof -i :8080  # Backend
lsof -i :3000  # Frontend

# Kill the process
kill -9 <PID>

# Or use the stop script
./scripts/dev-stop.sh
```

### PostgreSQL Won't Start

```bash
# Check status
sudo service postgresql status

# View logs
sudo tail -f /var/log/postgresql/postgresql-*.log

# Restart
sudo service postgresql restart
```

### Redis Won't Start

```bash
# Check status
sudo service redis-server status

# Restart
sudo service redis-server restart
```

### Database Connection Failed

```bash
# Test connection
psql -U invoice_user -d invoice_db -h localhost

# If fails, recreate database
sudo -u postgres psql
DROP DATABASE invoice_db;
DROP USER invoice_user;
\q

# Then run setup again
./scripts/dev-setup.sh
```

### Backend Won't Start

```bash
# Check logs
cat logs/backend.log

# Check if dependencies are installed
cd invoice-generator-backend
go mod download
go mod tidy

# Try running directly to see errors
./scripts/dev-backend.sh
```

### Frontend Won't Start

```bash
# Check logs
cat logs/frontend.log

# Reinstall dependencies
cd invoice-generator-frontend
rm -rf node_modules .next
npm install

# Try running directly to see errors
./scripts/dev-frontend.sh
```

### Migration Errors

```bash
# Check migration status
cd invoice-generator-backend
migrate -database "$POSTGRES_URL" -path migrations version

# Force to specific version
migrate -database "$POSTGRES_URL" -path migrations force <VERSION>

# Rollback
migrate -database "$POSTGRES_URL" -path migrations down 1
```

## Useful Commands

### Database

```bash
# Access database
psql -U invoice_user -d invoice_db -h localhost

# Backup database
pg_dump -U invoice_user -h localhost invoice_db > backup.sql

# Restore database
psql -U invoice_user -d invoice_db -h localhost < backup.sql

# Run migrations up
cd invoice-generator-backend
migrate -database "$POSTGRES_URL" -path migrations up

# Run migrations down
migrate -database "$POSTGRES_URL" -path migrations down 1
```

### Backend

```bash
# Build backend
cd invoice-generator-backend
go build -o invoice-generator ./cmd

# Run tests
go test ./...

# Format code
go fmt ./...

# Install new dependency
go get <package>
go mod tidy
```

### Frontend

```bash
# Install new package
cd invoice-generator-frontend
npm install <package>

# Build for production
npm run build

# Run production build
npm run start

# Lint code
npm run lint
```

### Logs

```bash
# View backend logs
tail -f logs/backend.log

# View frontend logs
tail -f logs/frontend.log

# View both logs
tail -f logs/*.log

# Clear logs
rm logs/*.log

# View last 100 lines
tail -n 100 logs/backend.log
```

## Performance Tips

### Backend Optimization

- Use `go build` to create a binary for faster startup
- Enable Go module caching: `export GOCACHE=/tmp/go-cache`
- Use `air` for hot reload: `go install github.com/air-verse/air@latest`

### Frontend Optimization

- Use Next.js Turbopack: `npm run dev` (already enabled)
- Clear `.next` cache if builds are slow: `rm -rf .next`
- Use `npm ci` instead of `npm install` for faster installs

### Database Optimization

- Increase PostgreSQL shared buffers for development
- Use connection pooling if needed
- Monitor slow queries: Enable `log_min_duration_statement`

## Development vs Docker

### When to Use Local Development

✅ Faster iteration cycles
✅ Direct access to logs and debugging
✅ Easier to use IDE debuggers
✅ Lower resource usage
✅ Instant code reloading (frontend)

### When to Use Docker

✅ Testing production-like environment
✅ Consistent environment across team
✅ CI/CD testing
✅ Easier onboarding for new developers
✅ Isolated services

### Switching Between Modes

```bash
# Stop local development
./scripts/dev-stop.sh
sudo service postgresql stop
sudo service redis-server stop

# Start Docker
docker-compose up -d

# Stop Docker
docker-compose down

# Start local development
./scripts/dev-start.sh
```

## Next Steps

1. ✅ Run `./scripts/dev-setup.sh` (one-time)
2. ✅ Start development: `./scripts/dev-start.sh`
3. ✅ Open http://localhost:3000
4. 🚀 Start coding!

## Support

For issues:
1. Check service status: `./scripts/dev-check.sh`
2. View logs: `./scripts/dev-logs.sh`
3. Restart services: `./scripts/dev-restart.sh`
4. If all else fails: Re-run `./scripts/dev-setup.sh`
