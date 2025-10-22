# Docker Deployment Guide

> Complete guide for running Invoice Generator with Docker

This guide covers everything you need to run the Invoice Generator application using Docker and Docker Compose.

---

## Prerequisites

Before you begin, ensure you have:

- **Docker Engine** 20.10 or higher
- **Docker Compose** 2.0 or higher
- **System Resources**
  - At least 4GB of available RAM
  - At least 10GB of free disk space

---

## Architecture

The Docker setup includes five services:

| Service | Description | Port | Image |
|---------|-------------|------|-------|
| **frontend** | Next.js application | 3000 | Built from `./invoice-generator-frontend` |
| **backend** | Go API server | 8080 | Built from `./invoice-generator-backend` |
| **db** | PostgreSQL database | 5432 | `postgres:15-alpine` |
| **redis** | Redis cache | 6379 | `redis:7-alpine` |
| **db-migrate** | Migration runner | N/A | Built from `./invoice-generator-backend` |

All services communicate through the `invoice-network` bridge network.

---

## Quick Start

### 1. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your secure values:

```env
# Database Configuration
DB_PASSWORD=your_secure_password_here

# JWT Authentication
JWT_SECRET=your_jwt_secret_change_this_in_production

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Security Note:** Always use strong, unique passwords and secrets in production!

### 2. Start All Services

Build and start everything in one command:

```bash
docker-compose up --build -d
```

This will:
1. Build the backend and frontend Docker images
2. Pull PostgreSQL and Redis images
3. Create Docker volumes for persistent storage
4. Start all services in the background
5. Run database migrations automatically

### 3. Verify Everything is Running

Check service status:

```bash
docker-compose ps
```

You should see all services in a "healthy" or "running" state.

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

---

## Common Commands

### Starting Services

```bash
# Start all services
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Start with rebuild
docker-compose up --build

# Start specific service only
docker-compose up backend
```

### Stopping Services

```bash
# Stop all services (preserves data)
docker-compose down

# Stop and remove all volumes (deletes data)
docker-compose down -v

# Stop specific service
docker-compose stop frontend
```

### Viewing Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100

# View logs with timestamps
docker-compose logs -f -t backend
```

### Building Images

```bash
# Build all services
docker-compose build

# Build without cache (fresh build)
docker-compose build --no-cache

# Build specific service
docker-compose build backend
```

### Service Management

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend

# Check service status
docker-compose ps

# View resource usage
docker stats
```

---

## Advanced Operations

### Accessing Service Shells

```bash
# Access backend container
docker-compose exec backend sh

# Access frontend container
docker-compose exec frontend sh

# Access PostgreSQL CLI
docker-compose exec db psql -U invoice_user -d invoice_db

# Access Redis CLI
docker-compose exec redis redis-cli
```

### Database Operations

```bash
# Create database backup
docker-compose exec db pg_dump -U invoice_user invoice_db > backup.sql

# Restore from backup
docker-compose exec -T db psql -U invoice_user invoice_db < backup.sql

# View database logs
docker-compose logs db

# Check database health
docker-compose exec db pg_isready -U invoice_user -d invoice_db
```

### Running Migrations Manually

```bash
# Run migrations
docker-compose up db-migrate

# View migration logs
docker-compose logs db-migrate
```

### File Access

```bash
# Copy files from container to host
docker cp invoice-backend:/app/storage/files ./backup-files

# Copy files from host to container
docker cp ./backup-files invoice-backend:/app/storage/files

# View generated PDFs
docker-compose exec backend ls -la /app/storage/files
```

---

## Data Persistence

Docker volumes ensure data persists between container restarts:

| Volume | Purpose | Data Stored |
|--------|---------|-------------|
| `postgres-data` | Database files | All PostgreSQL data |
| `redis-data` | Cache data | Redis cache and sessions |
| `backend-storage` | File storage | Generated PDFs, uploads |

### View Volumes

```bash
# List all volumes
docker volume ls

# Inspect volume
docker volume inspect invoice-generator-go_postgres-data

# View volume usage
docker system df -v
```

### Backup Volumes

```bash
# Backup database volume
docker run --rm \
  -v invoice-generator-go_postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz -C /data .

# Backup file storage
docker run --rm \
  -v invoice-generator-go_backend-storage:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/storage-backup.tar.gz -C /data .
```

---

## Troubleshooting

### Port Already in Use

If you see "port already in use" errors, you can:

**Option 1:** Stop the conflicting service
```bash
lsof -ti:8080 | xargs kill -9  # Kill process on port 8080
```

**Option 2:** Change ports in `docker-compose.yml`
```yaml
services:
  backend:
    ports:
      - "8081:8080"  # Map to different host port
  frontend:
    ports:
      - "3001:3000"  # Map to different host port
```

### Service Won't Start

Check service health and logs:

```bash
# View service status
docker-compose ps

# View detailed logs
docker-compose logs [service-name]

# Check health status
docker inspect invoice-backend | grep -A 10 Health
```

### Database Connection Issues

```bash
# Verify database is healthy
docker-compose ps db

# Test database connection
docker-compose exec db pg_isready -U invoice_user -d invoice_db

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Migration Failures

```bash
# View migration logs
docker-compose logs db-migrate

# Re-run migrations
docker-compose up db-migrate

# Access database to check migration status
docker-compose exec db psql -U invoice_user -d invoice_db
```

### Backend Build Failures

```bash
# Clean build without cache
docker-compose build --no-cache backend

# Check for Go errors
docker-compose logs backend

# Verify Go modules
cd invoice-generator-backend
go mod verify
go mod tidy
```

### Frontend Build Failures

```bash
# Clean build without cache
docker-compose build --no-cache frontend

# Check for Node.js errors
docker-compose logs frontend

# Clear Next.js cache locally
cd invoice-generator-frontend
rm -rf .next node_modules
```

### Container Keeps Restarting

```bash
# Check exit status
docker-compose ps

# View continuous logs
docker-compose logs -f [service-name]

# Check health check configuration
docker inspect invoice-backend | grep -A 20 Healthcheck
```

---

## Performance Optimization

### Enable Docker BuildKit

For faster builds:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker-compose build
```

### Resource Limits

Add resource constraints in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Use Multi-Stage Builds

Both Dockerfiles use multi-stage builds to minimize image size. The final images only contain runtime dependencies.

---

## Production Considerations

### Security

- **Change default credentials** in `.env`
- **Use Docker secrets** for sensitive data
- **Enable SSL/TLS** for database connections
- **Run containers as non-root** users
- **Regularly update** base images

### Networking

- **Use reverse proxy** (nginx, traefik) in front of services
- **Enable HTTPS** with SSL certificates (Let's Encrypt)
- **Configure firewall** rules appropriately
- **Restrict exposed ports** to only what's necessary

### Monitoring

- **Set up logging** aggregation (ELK, Loki)
- **Monitor resources** with Prometheus/Grafana
- **Configure alerts** for service health
- **Track application** metrics

### Backups

- **Automate database backups** with cron jobs
- **Store backups** in remote locations
- **Test restore** procedures regularly
- **Version control** configurations

---

## Cleanup

### Remove Containers Only

```bash
# Stop and remove containers
docker-compose down
```

### Remove Everything

```bash
# Remove containers and networks
docker-compose down

# Remove all volumes (WARNING: deletes all data)
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

### Clean Docker System

```bash
# Remove unused containers, networks, images
docker system prune

# Remove everything including volumes
docker system prune -a --volumes
```

---

## Next Steps

After getting Docker running:

1. **Explore the API** using tools like Postman or curl
2. **Set up CI/CD** pipeline for automated deployments
3. **Configure monitoring** and logging
4. **Review security** settings for production
5. **Set up backups** and disaster recovery

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)

---

**Questions or Issues?** Check the logs first with `docker-compose logs -f`
