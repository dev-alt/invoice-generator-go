# Docker Setup Guide

This guide explains how to build and run the entire Invoice Generator application using Docker.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- At least 4GB of available RAM
- At least 10GB of disk space

## Project Structure

The application consists of the following services:
- **Frontend**: Next.js application (Port 3000)
- **Backend**: Go API server (Port 8080)
- **Database**: PostgreSQL 15 (Port 5432)
- **Cache**: Redis 7 (Port 6379)
- **Migrations**: Database migration runner

## Quick Start

### 1. Clone and Navigate to Project

```bash
cd invoice-generator-go
```

### 2. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and set secure values:

```env
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_change_this_in_production
CORS_ALLOWED_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Build and Start All Services

Build and start all containers:

```bash
docker-compose up --build
```

Or run in detached mode:

```bash
docker-compose up --build -d
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432
- **Redis**: localhost:6379

## Docker Commands

### Start Services

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Start specific service
docker-compose up backend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v

# Stop specific service
docker-compose stop frontend
```

### Build Services

```bash
# Build all services
docker-compose build

# Build without cache
docker-compose build --no-cache

# Build specific service
docker-compose build backend
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100
```

### Check Service Status

```bash
# List running containers
docker-compose ps

# View resource usage
docker stats
```

### Execute Commands in Containers

```bash
# Access backend shell
docker-compose exec backend sh

# Access database
docker-compose exec db psql -U invoice_user -d invoice_db

# Access frontend shell
docker-compose exec frontend sh
```

## Service Details

### Frontend (Next.js)

- **Port**: 3000
- **Build Context**: `./invoice-generator-frontend`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Backend API URL
  - `NODE_ENV`: production

### Backend (Go)

- **Port**: 8080
- **Build Context**: `./invoice-generator-backend`
- **Environment Variables**:
  - `POSTGRES_URL`: Database connection string
  - `REDIS_URL`: Redis connection string
  - `JWT_SECRET`: JWT signing secret
  - `FILE_STORAGE_PATH`: Path for file storage
  - `CORS_ALLOWED_ORIGINS`: Allowed CORS origins
- **Health Check**: `http://localhost:8080/health`

### Database (PostgreSQL)

- **Port**: 5432
- **Image**: postgres:15-alpine
- **Database**: invoice_db
- **User**: invoice_user
- **Volume**: postgres-data

### Redis

- **Port**: 6379
- **Image**: redis:7-alpine
- **Volume**: redis-data

### Database Migrations

- Runs automatically on startup
- Depends on healthy database connection
- Uses golang-migrate tool

## Development vs Production

### Development Mode

For development, you might want to use volume mounts for live reloading:

```yaml
# Add to backend service in docker-compose.yml
volumes:
  - ./invoice-generator-backend:/app
  - backend-storage:/app/storage/files
```

### Production Mode

For production:

1. Use stronger passwords and secrets
2. Enable SSL/TLS for database connections
3. Use environment-specific configuration
4. Consider using Docker secrets for sensitive data
5. Set up proper backup strategies
6. Configure resource limits

## Troubleshooting

### Port Already in Use

If ports are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Frontend
  - "8081:8080"  # Backend
```

### Database Connection Issues

1. Check if database is healthy:
   ```bash
   docker-compose ps
   ```

2. View database logs:
   ```bash
   docker-compose logs db
   ```

3. Verify connection string in environment variables

### Migration Failures

1. Check migration logs:
   ```bash
   docker-compose logs db-migrate
   ```

2. Manually run migrations:
   ```bash
   docker-compose up db-migrate
   ```

### Frontend Build Failures

1. Ensure all dependencies are correctly listed in `package.json`
2. Check if `next.config.ts` has correct output settings
3. Clear node_modules and rebuild:
   ```bash
   docker-compose build --no-cache frontend
   ```

### Backend Build Failures

1. Verify Go module dependencies:
   ```bash
   cd invoice-generator-backend
   go mod tidy
   ```

2. Check for compilation errors:
   ```bash
   docker-compose build --no-cache backend
   ```

### Container Keeps Restarting

1. Check container logs:
   ```bash
   docker-compose logs -f [service-name]
   ```

2. Check health check status:
   ```bash
   docker inspect invoice-backend
   ```

## Data Persistence

Data is persisted in Docker volumes:

- `postgres-data`: Database files
- `redis-data`: Redis cache
- `backend-storage`: Uploaded files and invoices

### Backup Data

```bash
# Backup database
docker-compose exec db pg_dump -U invoice_user invoice_db > backup.sql

# Backup files
docker cp invoice-backend:/app/storage/files ./backup-files
```

### Restore Data

```bash
# Restore database
docker-compose exec -T db psql -U invoice_user invoice_db < backup.sql

# Restore files
docker cp ./backup-files invoice-backend:/app/storage/files
```

## Cleaning Up

### Remove All Containers and Images

```bash
# Stop and remove containers
docker-compose down

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

### Complete Cleanup

```bash
# Remove everything including volumes (WARNING: deletes all data)
docker-compose down -v --rmi all
```

## Performance Tuning

### Increase Resource Limits

Add to service definitions in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

### Enable BuildKit

For faster builds:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker-compose build
```

## Next Steps

1. Configure production-ready secrets
2. Set up CI/CD pipeline
3. Configure reverse proxy (nginx/traefik)
4. Enable HTTPS with SSL certificates
5. Set up monitoring and logging
6. Configure automated backups

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Review configuration files
- Consult Docker documentation
