# Invoice Generator Backend

> Go API server for invoice management and PDF generation

This is the backend service for the Invoice Generator application, built with Go and the Gin web framework.

---

## Technology Stack

- **Language**: Go 1.23
- **Web Framework**: Gin
- **Database**: PostgreSQL (using database/sql)
- **Cache**: Redis integration ready
- **Authentication**: JWT (golang-jwt/jwt/v5)
- **Password Hashing**: bcrypt
- **Migrations**: golang-migrate
- **PDF Generation**: wkhtmltopdf

---

## Project Structure

```
invoice-generator-backend/
├── api/                    # HTTP handlers and middleware
│   ├── routes.go          # Route definitions
│   ├── middleware.go      # JWT authentication middleware
│   ├── users.go           # User registration/login
│   ├── invoices.go        # Invoice CRUD operations
│   └── templates.go       # Template management
│
├── cmd/                    # Application entry point
│   └── main.go            # Server initialization
│
├── config/                 # Configuration management
│   └── config.go          # Load env vars
│
├── models/                 # Data structures
│   └── models.go          # User, Invoice, Template, InvoiceItem
│
├── storage/                # Data access layer
│   ├── postgres.go        # Database connection
│   ├── users.go           # User queries
│   ├── invoices.go        # Invoice queries
│   └── templates.go       # Template queries
│
├── utils/                  # Utility functions
│   ├── jwt.go             # JWT generation and validation
│   └── auth.go            # Password hashing with bcrypt
│
├── pdf/                    # PDF generation
│   └── generator.go       # wkhtmltopdf integration
│
├── migrations/             # Database migrations
│   ├── 000001_initial_schema.up.sql
│   └── 000001_initial_schema.down.sql
│
├── go.mod                  # Go module dependencies
├── go.sum                  # Dependency checksums
├── Dockerfile              # Production Docker image
├── Dockerfile.migrate      # Migration runner image
└── init.sql               # PostgreSQL initialization
```

---

## Architecture

### Layered Design

The backend follows a clean layered architecture:

1. **API Layer** (`api/`) — HTTP handlers, routing, middleware
2. **Business Logic** — Model validation and processing
3. **Storage Layer** (`storage/`) — Database interactions
4. **Utilities** (`utils/`) — Cross-cutting concerns (JWT, auth)

### Key Patterns

- **Dependency Injection** — Configuration passed through functions
- **Middleware Chain** — Authentication via Gin middleware
- **Repository Pattern** — Storage layer abstracts database access
- **UUID Primary Keys** — All entities use UUIDs (uuid-ossp extension)

---

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Create new user account |
| POST | `/api/login` | Authenticate user, return JWT |

### Protected Routes (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/invoices` | Create new invoice |
| GET | `/api/invoices/:id` | Get invoice details |
| POST | `/api/templates` | Upload HTML template |
| GET | `/api/templates` | List user's templates |

**Authentication**: Include JWT in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Configuration

### Environment Variables

The backend reads configuration from environment variables:

```env
# Database
POSTGRES_URL=postgresql://invoice_user:password@localhost:5432/invoice_db?sslmode=disable

# Redis (optional)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_secret_key_here

# Storage
FILE_STORAGE_PATH=./storage/files

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

See `config/config.go` for the complete list.

---

## Development

### Prerequisites

- Go 1.23 or higher
- PostgreSQL 15
- Redis 7 (optional)
- wkhtmltopdf 0.12.6+
- golang-migrate (for migrations)

### Setup

```bash
# Install dependencies
go mod download

# Verify dependencies
go mod verify
go mod tidy
```

### Run Locally

```bash
# Set up environment (load .env file)
export $(cat .env | xargs)

# Run the server
go run ./cmd

# Or build and run
go build -o invoice-generator ./cmd
./invoice-generator
```

The server will start on port 8080 (or `$API_PORT` if set).

### Testing

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Verbose output
go test -v ./...

# Test specific package
go test ./storage
```

### Code Quality

```bash
# Format code
go fmt ./...

# Run linter (requires golangci-lint)
golangci-lint run

# Vet code
go vet ./...
```

---

## Database

### Migrations

Migrations are managed with [golang-migrate](https://github.com/golang-migrate/migrate).

```bash
# Run all migrations up
migrate -database "$POSTGRES_URL" -path migrations up

# Rollback one migration
migrate -database "$POSTGRES_URL" -path migrations down 1

# Check current version
migrate -database "$POSTGRES_URL" -path migrations version

# Force to specific version (use carefully!)
migrate -database "$POSTGRES_URL" -path migrations force <version>
```

### Create New Migration

```bash
cd migrations

# Create new migration files
touch 000002_add_feature.up.sql
touch 000002_add_feature.down.sql
```

**Naming convention**: `NNNNNN_description.up.sql` and `NNNNNN_description.down.sql`

### Schema Overview

- **users** — User accounts with bcrypt hashed passwords
- **templates** — HTML templates for invoice generation
- **invoices** — Invoice records with financial data
- **invoice_items** — Line items for each invoice

All tables use UUID primary keys via the `uuid-ossp` extension.

---

## Authentication & Security

### JWT Tokens

- **Signing**: HMAC-SHA256 with `JWT_SECRET`
- **Expiration**: 24 hours from issue time
- **Claims**: `user_id`, `exp`, `iat`

### Password Security

- **Hashing**: bcrypt with automatic salt
- **Validation**: Constant-time comparison
- **Storage**: Only password hashes stored in database

### Middleware

The `AuthMiddleware()` function:
1. Extracts JWT from `Authorization: Bearer <token>` header
2. Validates signature and expiration
3. Extracts user ID and adds to Gin context
4. Returns 401 Unauthorized if invalid

---

## PDF Generation

### How It Works

1. **Template Selection** — Load HTML template from database
2. **Data Injection** — Populate template with invoice data using `html/template`
3. **HTML Generation** — Execute template to produce HTML
4. **PDF Conversion** — Call wkhtmltopdf to convert HTML to PDF
5. **Storage** — Save PDF to `FILE_STORAGE_PATH`

### Template Variables

Templates have access to:
- `Invoice` — Invoice record (ID, number, dates, amounts, etc.)
- `InvoiceItems` — Array of line items
- `Company` — User/company details

Example template syntax:
```html
<h1>Invoice #{{.Invoice.InvoiceNumber}}</h1>
<p>Customer: {{.Invoice.CustomerName}}</p>
{{range .InvoiceItems}}
  <li>{{.Description}} - ${{.TotalPrice}}</li>
{{end}}
```

---

## Docker

### Build Image

```bash
# Build backend image
docker build -t invoice-backend .

# Build with specific target
docker build --target production -t invoice-backend .
```

### Run Container

```bash
# Run with environment variables
docker run -p 8080:8080 \
  -e POSTGRES_URL="postgresql://..." \
  -e JWT_SECRET="secret" \
  invoice-backend
```

### Multi-Stage Build

The Dockerfile uses multi-stage builds:
1. **Builder stage** — Compile Go binary
2. **Production stage** — Minimal Alpine image with binary only

This reduces final image size significantly.

---

## Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Use secure database credentials
- [ ] Enable PostgreSQL SSL (`sslmode=require`)
- [ ] Configure proper CORS origins
- [ ] Set up log aggregation
- [ ] Enable health check endpoint
- [ ] Configure reverse proxy (nginx, traefik)
- [ ] Set up automated backups
- [ ] Monitor application metrics

### Health Check

The backend includes a `/health` endpoint for container orchestration.

---

## Troubleshooting

### Database Connection Fails

```bash
# Test connection manually
psql -U invoice_user -d invoice_db -h localhost

# Check connection string format
# postgresql://user:password@host:port/database?sslmode=disable

# Verify PostgreSQL is running
sudo service postgresql status
```

### Migration Errors

```bash
# Check current migration version
migrate -database "$POSTGRES_URL" -path migrations version

# View migration status in database
psql -U invoice_user -d invoice_db -c "SELECT * FROM schema_migrations;"

# Fix stuck migration
migrate -database "$POSTGRES_URL" -path migrations force <version>
```

### JWT Validation Fails

- Ensure `JWT_SECRET` matches between token generation and validation
- Check token hasn't expired (24-hour default)
- Verify Authorization header format: `Bearer <token>`
- Check for clock skew between systems

### PDF Generation Fails

```bash
# Verify wkhtmltopdf is installed
which wkhtmltopdf
wkhtmltopdf --version

# Check file permissions
ls -la ./storage/files

# Test wkhtmltopdf directly
echo "<h1>Test</h1>" > test.html
wkhtmltopdf test.html test.pdf
```

---

## Dependencies

### Core Dependencies

```go
github.com/gin-gonic/gin          // Web framework
github.com/lib/pq                 // PostgreSQL driver
github.com/golang-jwt/jwt/v5      // JWT implementation
github.com/google/uuid            // UUID generation
golang.org/x/crypto/bcrypt        // Password hashing
github.com/joho/godotenv          // Environment variable loading
github.com/gin-contrib/cors       // CORS middleware
```

### Development Tools

- `golang-migrate/migrate` — Database migrations
- `golangci-lint` — Code linting (optional)

---

**Need help?** Check logs, verify environment variables, and ensure all services are running
