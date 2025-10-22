# Invoice Generator

> A modern full-stack invoice management system with PDF generation

Invoice Generator is a production-ready application demonstrating modern web development practices with a Go backend and Next.js frontend. Create, manage, and generate professional PDF invoices with customizable templates.

---

## Features

### Core Functionality
- **Invoice Management** — Create, view, and manage invoices with detailed line items
- **PDF Generation** — Professional PDF output using wkhtmltopdf
- **Custom Templates** — Upload and manage your own HTML invoice templates
- **User Authentication** — Secure JWT-based authentication system
- **Multi-Currency Support** — Handle invoices in different currencies

### Technical Highlights
- **RESTful API** — Clean API design with protected and public endpoints
- **Database Migrations** — Version-controlled schema using golang-migrate
- **Caching Layer** — Redis integration for improved performance
- **Docker Support** — Full Docker Compose setup for easy deployment
- **Development Scripts** — Comprehensive tooling for local development

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Go 1.23 + Gin Framework |
| **Frontend** | Next.js 15 + React 19 + TypeScript |
| **Database** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Auth** | JWT (golang-jwt/jwt) |
| **PDF** | wkhtmltopdf |

---

## Quick Start

### Option 1: Docker (Recommended)

**Perfect for:** Quick evaluation, production-like environment, team consistency

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# 2. Start everything
docker-compose up --build -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
```

### Option 2: Local Development (WSL/Linux)

**Perfect for:** Active development, debugging, faster iteration

```bash
# 1. One-time setup (installs dependencies)
chmod +x scripts/*.sh
./scripts/dev-setup.sh

# 2. Start all services
./scripts/dev-start.sh

# 3. Access the application
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080

# 4. Check status
./scripts/dev-check.sh

# 5. Stop when done
./scripts/dev-stop.sh
```

---

## Project Structure

```
invoice-generator-go/
├── invoice-generator-backend/    # Go API server
│   ├── api/                      # HTTP handlers and routes
│   ├── cmd/                      # Application entry point
│   ├── config/                   # Configuration loading
│   ├── migrations/               # Database migrations
│   ├── models/                   # Domain models
│   ├── pdf/                      # PDF generation
│   ├── storage/                  # Data access layer
│   └── utils/                    # JWT, auth, helpers
│
├── invoice-generator-frontend/   # Next.js application
│   ├── src/app/                  # App Router pages
│   ├── components/               # React components
│   └── public/                   # Static assets
│
├── scripts/                      # Development helper scripts
│   ├── dev-setup.sh             # One-time setup
│   ├── dev-start.sh             # Start all services
│   ├── dev-stop.sh              # Stop all services
│   └── dev-check.sh             # Check service status
│
├── docker-compose.yml            # Docker orchestration
├── .env.example                  # Environment template
└── README.md                     # This file
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_PASSWORD=your_secure_password_here

# JWT Authentication
JWT_SECRET=your_jwt_secret_change_this_in_production

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000

# API URL (for frontend)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Important:** Change default passwords and secrets before deploying to production!

---

## Development Workflow

### Daily Development Commands

```bash
# Start work
./scripts/dev-start.sh

# Check everything is running
./scripts/dev-check.sh

# View logs
./scripts/dev-logs.sh
tail -f logs/backend.log
tail -f logs/frontend.log

# Restart after backend changes
./scripts/dev-restart.sh

# Stop work
./scripts/dev-stop.sh
```

### Backend Development

```bash
cd invoice-generator-backend

# Run tests
go test ./...

# Format code
go fmt ./...

# Build binary
go build -o invoice-generator ./cmd

# Run backend only
go run ./cmd
```

### Frontend Development

```bash
cd invoice-generator-frontend

# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Database Operations

```bash
# Access PostgreSQL
psql -U invoice_user -d invoice_db -h localhost

# Run migrations
cd invoice-generator-backend
migrate -database "$POSTGRES_URL" -path migrations up

# Rollback migration
migrate -database "$POSTGRES_URL" -path migrations down 1
```

---

## API Endpoints

### Public Endpoints
- `POST /api/register` — Create new user account
- `POST /api/login` — Authenticate and receive JWT token

### Protected Endpoints (Require Authentication)
- `POST /api/invoices` — Create new invoice
- `GET /api/invoices/:id` — Retrieve invoice details
- `POST /api/templates` — Upload custom invoice template
- `GET /api/templates` — List all templates

**Authentication:** Include JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Documentation

- **[Local Development Guide](DEV_README.md)** — Detailed setup and troubleshooting for WSL/Linux
- **[Docker Guide](README.docker.md)** — Complete Docker setup and operations
- **[Scripts Reference](SCRIPTS_REFERENCE.md)** — Full reference for all development scripts
- **[Claude Code Guide](CLAUDE.md)** — Architecture and guidance for AI assistants

---

## Troubleshooting

### Port Conflicts
```bash
# Check what's using ports
lsof -i :8080  # Backend
lsof -i :3000  # Frontend

# Kill processes
lsof -ti:8080 | xargs kill -9
```

### Database Issues
```bash
# Check PostgreSQL status
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart

# Test connection
psql -U invoice_user -d invoice_db -h localhost
```

### Backend Won't Start
```bash
# View logs
cat logs/backend.log

# Check dependencies
cd invoice-generator-backend
go mod download
go mod tidy
```

### Frontend Won't Start
```bash
# View logs
cat logs/frontend.log

# Clear cache and reinstall
cd invoice-generator-frontend
rm -rf node_modules .next
npm install
```

For more detailed troubleshooting, see [DEV_README.md](DEV_README.md#troubleshooting).

---

## License

See the [LICENSE](LICENSE) file for details.

---

**Built with Go and Next.js** • Designed for developers who value clean architecture and modern tooling
