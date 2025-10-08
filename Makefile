# Makefile for Invoice Generator

.PHONY: help build up down logs restart clean rebuild ps exec-backend exec-frontend exec-db backup restore health

# Default target
help:
	@echo "Invoice Generator - Docker Management"
	@echo ""
	@echo "Available commands:"
	@echo "  make build          - Build all Docker images"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make logs           - View logs from all services"
	@echo "  make restart        - Restart all services"
	@echo "  make clean          - Remove containers, networks, and volumes"
	@echo "  make rebuild        - Rebuild and restart all services"
	@echo "  make ps             - List running containers"
	@echo "  make health         - Check health status of services"
	@echo "  make exec-backend   - Access backend container shell"
	@echo "  make exec-frontend  - Access frontend container shell"
	@echo "  make exec-db        - Access PostgreSQL database"
	@echo "  make backup         - Backup database"
	@echo "  make restore        - Restore database from backup"
	@echo ""

# Build all images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Start with logs
up-logs:
	docker-compose up

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# View logs for specific service
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f db

# Restart all services
restart:
	docker-compose restart

# Restart specific service
restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

# Clean up everything
clean:
	docker-compose down -v --rmi local

# Rebuild and restart
rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# List containers
ps:
	docker-compose ps

# Check service health
health:
	@echo "Checking service health..."
	@docker inspect invoice-backend --format='Backend: {{.State.Health.Status}}' 2>/dev/null || echo "Backend: Not running"
	@docker inspect invoice-frontend --format='Frontend: {{.State.Health.Status}}' 2>/dev/null || echo "Frontend: Not running"
	@docker inspect invoice-db --format='Database: {{.State.Health.Status}}' 2>/dev/null || echo "Database: Not running"
	@docker inspect invoice-redis --format='Redis: {{.State.Health.Status}}' 2>/dev/null || echo "Redis: Not running"

# Execute shell in backend
exec-backend:
	docker-compose exec backend sh

# Execute shell in frontend
exec-frontend:
	docker-compose exec frontend sh

# Access PostgreSQL
exec-db:
	docker-compose exec db psql -U invoice_user -d invoice_db

# Backup database
backup:
	@echo "Creating database backup..."
	@mkdir -p backups
	@docker-compose exec -T db pg_dump -U invoice_user invoice_db > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in backups/ directory"

# Restore database (use: make restore FILE=backup.sql)
restore:
	@if [ -z "$(FILE)" ]; then \
		echo "Error: Please specify FILE=<backup_file>"; \
		exit 1; \
	fi
	@echo "Restoring database from $(FILE)..."
	@docker-compose exec -T db psql -U invoice_user invoice_db < $(FILE)
	@echo "Database restored successfully"

# Development mode (with hot reload)
dev:
	@echo "Starting in development mode..."
	@echo "Note: Make sure to configure volume mounts for hot reload"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production mode
prod:
	@echo "Starting in production mode..."
	docker-compose up -d

# Run migrations
migrate:
	docker-compose up db-migrate

# View resource usage
stats:
	docker stats

# Setup environment
setup:
	@if [ ! -f .env ]; then \
		echo "Creating .env file from .env.example..."; \
		cp .env.example .env; \
		echo "Please edit .env file with your configuration"; \
	else \
		echo ".env file already exists"; \
	fi
