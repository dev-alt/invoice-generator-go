# Getting Started with Docker

This guide will help you quickly set up and run the Invoice Generator application using Docker.

## Quick Start (3 Steps)

### Step 1: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your preferred text editor and set secure values for:
- `DB_PASSWORD`
- `JWT_SECRET`

### Step 2: Build and Start

```bash
docker-compose up --build -d
```

This command will:
- Build the frontend Docker image
- Build the backend Docker image
- Pull the PostgreSQL and Redis images
- Start all services
- Run database migrations

### Step 3: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## Using Make Commands (Optional)

If you have `make` installed, you can use convenient shortcuts:

```bash
# Setup environment file
make setup

# Build and start all services
make build
make up

# View logs
make logs

# Stop services
make down

# See all available commands
make help
```

## What's Running?

After starting, you'll have 5 services running:

1. **Frontend** (Port 3000) - Next.js web application
2. **Backend** (Port 8080) - Go API server
3. **Database** (Port 5432) - PostgreSQL database
4. **Redis** (Port 6379) - Cache server
5. **Migrations** - Runs once to set up database schema

## Verify Everything is Working

### Check Service Status

```bash
docker-compose ps
```

All services should show as "Up" or "healthy".

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
```

### Test the Backend

```bash
curl http://localhost:8080/health
```

Should return a health status response.

### Test the Frontend

Open http://localhost:3000 in your browser. You should see the invoice generator interface.

## Common Commands

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart
```

### Rebuild After Code Changes

```bash
docker-compose up --build
```

### View Real-time Logs

```bash
docker-compose logs -f
```

### Clean Everything (including data)

```bash
docker-compose down -v
```

⚠️ **Warning**: This will delete all database data!

## Troubleshooting

### Services Won't Start

1. Check if ports are available:
   ```bash
   # Windows (PowerShell)
   netstat -ano | findstr "3000 8080 5432"
   ```

2. View error logs:
   ```bash
   docker-compose logs
   ```

### Database Connection Errors

1. Wait for database to be ready (takes ~10 seconds on first start)
2. Check database health:
   ```bash
   docker-compose ps db
   ```

### Frontend Can't Connect to Backend

1. Verify backend is running:
   ```bash
   curl http://localhost:8080/health
   ```

2. Check CORS settings in `.env`:
   ```
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

## Next Steps

- Read the full [Docker Documentation](README.docker.md)
- Configure environment variables
- Explore the API endpoints
- Start developing!

## Need Help?

- Check service logs: `docker-compose logs [service-name]`
- Verify configuration in `.env`
- Review `docker-compose.yml` for service settings
- Read the full documentation in `README.docker.md`
