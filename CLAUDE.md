# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Invoice Generator is a full-stack application with a Go backend and Next.js frontend for creating and managing invoices with PDF generation capabilities. The backend uses Gin framework with PostgreSQL, while the frontend is built with Next.js 15, React 19, and Tailwind CSS.

**Tech Stack:**
- **Backend**: Go 1.23, Gin web framework, PostgreSQL 15, Redis 7, golang-migrate
- **Frontend**: Next.js 15.1.3, React 19, TypeScript 5, Tailwind CSS
- **PDF Generation**: wkhtmltopdf
- **Auth**: JWT tokens (golang-jwt/jwt/v5)
- **Deployment**: Docker Compose or local WSL development

## Architecture

### Backend Structure (Go)

```
invoice-generator-backend/
├── cmd/main.go              # Application entry point, server setup
├── api/                     # HTTP handlers and routes
│   ├── routes.go           # Route definitions (public + protected)
│   ├── middleware.go       # Auth middleware (JWT validation)
│   ├── users.go            # User registration/login handlers
│   ├── invoices.go         # Invoice CRUD handlers
│   └── templates.go        # Template upload/list handlers
├── models/models.go        # Domain models (User, Invoice, Template, InvoiceItem)
├── storage/                # Data access layer
│   ├── postgres.go         # Database connection setup
│   ├── users.go            # User queries
│   ├── invoices.go         # Invoice queries
│   └── templates.go        # Template queries
├── utils/                  # Utility functions
│   ├── jwt.go              # JWT generation and validation
│   └── auth.go             # Password hashing with bcrypt
├── pdf/generator.go        # PDF generation using wkhtmltopdf
├── config/config.go        # Configuration loading from env vars
└── migrations/             # Database migrations (golang-migrate format)
    └── 000001_initial_schema.up.sql
```

**Key architectural patterns:**
- Handler → Storage layer separation (no direct DB access in handlers)
- JWT middleware protects routes under `/api/protected`
- UUIDs for all primary keys (postgres uuid-ossp extension)
- Environment-based configuration via `.env` files

### Frontend Structure (Next.js)

```
invoice-generator-frontend/
├── src/app/                # Next.js App Router structure
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── login/page.tsx      # Login page
│   ├── register/page.tsx   # Registration page
│   └── api/invoices/routes.ts  # API route handlers
├── components/             # React components (likely shadcn/ui)
└── public/                 # Static assets
```

**Frontend tech:**
- Next.js 15 with App Router and Turbopack
- React 19 with TypeScript
- Tailwind CSS + shadcn/ui components (Radix UI primitives)
- Axios for API calls to backend
- React Hook Form for form handling

## Development Commands

### Initial Setup (One-time)

**Local Development (WSL/Linux):**
```bash
chmod +x scripts/*.sh
./scripts/dev-setup.sh
```

**Docker:**
```bash
cp .env.example .env
# Edit .env with your credentials
docker-compose up --build -d
```

### Daily Development

**Start all services:**
```bash
# WSL/Linux
./scripts/dev-start.sh

# Docker
docker-compose up -d
```

**Check service status:**
```bash
./scripts/dev-check.sh
```

**View logs:**
```bash
# WSL/Linux
./scripts/dev-logs.sh
tail -f logs/backend.log
tail -f logs/frontend.log

# Docker
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Stop services:**
```bash
# WSL/Linux
./scripts/dev-stop.sh

# Docker
docker-compose down
```

**Restart services:**
```bash
./scripts/dev-restart.sh
```

### Backend Development

**Run backend only (foreground):**
```bash
cd invoice-generator-backend
go run ./cmd
# Or use the script:
./scripts/dev-backend.sh
```

**Run tests:**
```bash
cd invoice-generator-backend
go test ./...
```

**Format code:**
```bash
cd invoice-generator-backend
go fmt ./...
```

**Build binary:**
```bash
cd invoice-generator-backend
go build -o invoice-generator ./cmd
```

**Add new dependency:**
```bash
cd invoice-generator-backend
go get <package>
go mod tidy
```

### Frontend Development

**Run frontend only (foreground):**
```bash
cd invoice-generator-frontend
npm run dev
# Or use the script:
./scripts/dev-frontend.sh
```

**Build for production:**
```bash
cd invoice-generator-frontend
npm run build
npm run start
```

**Lint:**
```bash
cd invoice-generator-frontend
npm run lint
```

**Install new package:**
```bash
cd invoice-generator-frontend
npm install <package>
```

### Database Operations

**Access PostgreSQL:**
```bash
psql -U invoice_user -d invoice_db -h localhost
# Password: dev_password (or from .env.development)
```

**Run migrations manually:**
```bash
cd invoice-generator-backend
migrate -database "postgresql://invoice_user:dev_password@localhost:5432/invoice_db?sslmode=disable" -path migrations up
```

**Rollback migration:**
```bash
migrate -database "$POSTGRES_URL" -path migrations down 1
```

**Create new migration:**
```bash
cd invoice-generator-backend/migrations
# Name format: NNNNNN_description.up.sql and NNNNNN_description.down.sql
```

**Access Redis:**
```bash
redis-cli
```

## Important Implementation Details

### Authentication Flow

1. User registers via `POST /api/register` → password hashed with bcrypt
2. User logs in via `POST /api/login` → JWT token returned (24h expiration)
3. Protected routes require `Authorization: Bearer <token>` header
4. Middleware validates JWT and extracts `user_id` claim

### PDF Generation

- Uses wkhtmltopdf command-line tool
- HTML templates stored in database (Template model)
- Template rendering uses Go's `html/template` package
- PDF files generated per invoice and stored at configured path
- Invoice data + items injected into template via `DataForTemplate` struct

### Database Schema

- All tables use UUID primary keys (uuid-ossp extension required)
- Users table: email (unique), password_hash, company_name
- Templates table: user_id FK, name, language, content (HTML)
- Invoices table: user_id FK, template_id FK (optional), financial fields, status enum
- InvoiceItems table: invoice_id FK, description, quantity, unit_price

### CORS Configuration

Backend hardcoded to allow `http://localhost:3000` (see `cmd/main.go:33`). For production, configure via `CORS_ALLOWED_ORIGINS` env var.

### Environment Variables

**Backend (.env or .env.development):**
- `POSTGRES_URL` - Full PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT signing (change in production!)
- `FILE_STORAGE_PATH` - Path for storing generated PDFs
- `API_PORT` - Backend port (default 8080)

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default http://localhost:8080)
- `NODE_ENV` - Environment mode

## Development Workflow Tips

### When Adding New Features

1. **Backend changes**: Edit Go files → restart with `./scripts/dev-restart.sh` (no hot reload)
2. **Frontend changes**: Next.js has hot reload enabled automatically
3. **Database changes**: Create migration files, run `migrate up`, restart backend
4. **New API endpoints**: Add to `api/routes.go`, implement handler, add storage layer if needed

### Frontend Hydration Warning

The project handles React hydration warnings from browser extensions (password managers) by using client-only components for login forms. If adding auth-related UI, use dynamic imports or `'use client'` directive.

### Testing Docker Builds Locally

```bash
# Build and test backend image
cd invoice-generator-backend
docker build -t invoice-backend .

# Build and test frontend image
cd invoice-generator-frontend
docker build -t invoice-frontend .
```

### Port Conflicts

Default ports:
- Backend: 8080
- Frontend: 3000
- PostgreSQL: 5432
- Redis: 6379

If ports conflict:
```bash
lsof -i :8080
lsof -ti:8080 | xargs kill -9
```

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `sudo service postgresql status`
- Check Redis is running: `sudo service redis-server status`
- Verify database connection string in .env
- Check logs: `cat logs/backend.log`

### Frontend won't start
- Clear Next.js cache: `rm -rf invoice-generator-frontend/.next`
- Reinstall dependencies: `cd invoice-generator-frontend && npm ci`
- Check logs: `cat logs/frontend.log`

### Migration errors
- Check current version: `migrate -database "$POSTGRES_URL" -path migrations version`
- Force to specific version: `migrate -database "$POSTGRES_URL" -path migrations force <VERSION>`

### PDF generation fails
- Ensure wkhtmltopdf is installed: `which wkhtmltopdf`
- Check template content is valid HTML
- Verify file storage path exists and is writable

## Important Notes

- **Never commit .env files** (they contain secrets)
- **wkhtmltopdf** may require manual installation on some platforms
- Scripts in `scripts/` directory require execute permissions (`chmod +x scripts/*.sh`)
- PostgreSQL and Redis services remain running after `dev-stop.sh` (only stops app processes)
- Docker mode and local mode use different database instances (don't mix them)
- Frontend uses Turbopack for faster dev builds (Next.js 15 feature)
