# Invoice Generator

A full-stack invoice generation application with Go backend and Next.js frontend.

## 🚀 Quick Start

Choose your development method:

### Option 1: Docker (Recommended for Production)

```bash
# Setup
cp .env.example .env
# Edit .env with your configuration

# Start everything
docker-compose up --build -d

# Access
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

📖 **Full Documentation**: [README.docker.md](README.docker.md)

### Option 2: Local Development (WSL)

#### From Windows PowerShell:
```powershell
# One-time setup
.\dev.ps1 setup

# Start development
.\dev.ps1 start

# Check status
.\dev.ps1 check
```

#### From WSL Terminal:
```bash
# One-time setup
./scripts/dev-setup.sh

# Start development
./scripts/dev-start.sh

# Check status
./scripts/dev-check.sh
```

📖 **Full Documentation**: [DEV_README.md](DEV_README.md)  
📖 **Quick Reference**: [QUICK_START.md](QUICK_START.md)

## 📁 Project Structure

```
invoice-generator-go/
├── invoice-generator-backend/     # Go API server
│   ├── api/                       # API handlers
│   ├── cmd/                       # Entry point
│   ├── config/                    # Configuration
│   ├── models/                    # Data models
│   ├── storage/                   # Database layer
│   ├── pdf/                       # PDF generation
│   ├── migrations/                # Database migrations
│   └── templates/                 # Invoice templates
│
├── invoice-generator-frontend/    # Next.js application
│   └── src/
│       ├── app/                   # App router pages
│       ├── (components)/          # React components
│       └── (lib)/                 # Utilities
│
├── scripts/                       # Development scripts
│   ├── dev-setup.sh              # Setup script
│   ├── dev-start.sh              # Start services
│   ├── dev-stop.sh               # Stop services
│   ├── dev-check.sh              # Check status
│   └── ...
│
├── docker-compose.yml            # Docker orchestration
├── docker-compose.dev.yml        # Docker dev overrides
├── Makefile                      # Make commands
└── dev.ps1                       # PowerShell wrapper
```

## 🛠️ Technology Stack

### Backend
- **Language**: Go 1.23
- **Framework**: Gin
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **PDF**: wkhtmltopdf
- **Migrations**: golang-migrate

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI**: React 19 + Tailwind CSS
- **Components**: Radix UI
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Development**: WSL2 (Ubuntu 22.04)

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.docker.md](README.docker.md) | Complete Docker setup and deployment guide |
| [DEV_README.md](DEV_README.md) | Local development guide (WSL) |
| [QUICK_START.md](QUICK_START.md) | Quick start reference |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Docker quick start guide |
| [hld.md](hld.md) | High-level design document |

## 🎯 Features

- ✅ User authentication (JWT)
- ✅ Invoice creation and management
- ✅ Multiple invoice templates
- ✅ PDF generation
- ✅ Template customization
- ✅ RESTful API
- ✅ Modern responsive UI
- ✅ Docker support
- ✅ Database migrations
- ✅ Redis caching

## 🔧 Development Commands

### Docker Mode

```bash
make build          # Build images
make up             # Start services
make down           # Stop services
make logs           # View logs
make ps             # List containers
make health         # Check health
```

### Local Mode (PowerShell)

```powershell
.\dev.ps1 setup     # Initial setup
.\dev.ps1 start     # Start all services
.\dev.ps1 stop      # Stop all services
.\dev.ps1 check     # Check status
.\dev.ps1 logs      # View logs
.\dev.ps1 restart   # Restart services
```

### Local Mode (WSL Bash)

```bash
./scripts/dev-setup.sh      # Initial setup
./scripts/dev-start.sh      # Start all services
./scripts/dev-stop.sh       # Stop all services
./scripts/dev-check.sh      # Check status
./scripts/dev-logs.sh       # View logs
./scripts/dev-restart.sh    # Restart services
```

## 🌐 Access Points

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:8080 | 8080 |
| PostgreSQL | localhost:5432 | 5432 |
| Redis | localhost:6379 | 6379 |

## 📝 Environment Variables

### Docker (.env)
```bash
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
CORS_ALLOWED_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Local Development (.env.development)
```bash
POSTGRES_URL=postgresql://invoice_user:dev_password@localhost:5432/invoice_db?sslmode=disable
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🧪 Testing

```bash
# Backend tests
cd invoice-generator-backend
go test ./...

# Frontend tests (if configured)
cd invoice-generator-frontend
npm test
```

## 📦 Building for Production

### Docker
```bash
docker-compose up --build -d
```

### Manual Build
```bash
# Backend
cd invoice-generator-backend
go build -o invoice-generator ./cmd

# Frontend
cd invoice-generator-frontend
npm run build
npm run start
```

## 🤝 Development Workflow

1. **Choose your method**: Docker or Local
2. **Initial setup**: Run setup script/command
3. **Start services**: Use start script/command
4. **Develop**: Edit code (auto-reload for frontend)
5. **Test**: Access http://localhost:3000
6. **Stop**: Use stop script/command

## 🐛 Troubleshooting

### Port Conflicts
```bash
# Check what's using a port
lsof -i :3000
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Database Issues
```bash
# Docker
docker-compose down -v
docker-compose up -d

# Local
./scripts/dev-stop.sh
sudo service postgresql restart
./scripts/dev-setup.sh
```

### Reset Everything
```bash
# Docker
docker-compose down -v --rmi all
docker-compose up --build -d

# Local
./scripts/dev-stop.sh
sudo service postgresql stop
sudo service redis-server stop
./scripts/dev-setup.sh
```

## 📄 License

[Your License Here]

## 👥 Contributing

[Your Contributing Guidelines Here]

## 📧 Support

For issues and questions:
1. Check the appropriate documentation (Docker/Local)
2. Review troubleshooting sections
3. Check service status and logs
4. [Create an issue or contact support]

---

**Quick Links:**
- 🐳 [Docker Guide](README.docker.md)
- 💻 [Local Development Guide](DEV_README.md)
- ⚡ [Quick Start](QUICK_START.md)
- 📖 [Getting Started with Docker](GETTING_STARTED.md)
