# Invoice Generator — Full-stack sample app

Invoice Generator is a small, production-like sample app that demonstrates a modern
full-stack web application using a Go backend and a Next.js frontend. It includes
user authentication, templated invoices, PDF generation hooks, and local developer
scripts to get running quickly.

This repository contains two main apps:

- `invoice-generator-backend/` — Go API server (Gin, PostgreSQL)
- `invoice-generator-frontend/` — Next.js frontend (React, Tailwind)

Key features
------------

- JWT-based authentication and user management
- Create, list and manage invoice templates and invoices
- PDF generation integration (wkhtmltopdf / wkhtmltox)
- Database migrations (golang-migrate)
- Simple dev tooling for WSL/local development and Docker

Quick start (recommended: Docker)
--------------------------------

1. Copy environment file and adjust values:

```bash
cp .env.example .env
# Edit .env to set DB credentials and secrets
```

2. Start with Docker (builds images and runs services):

```bash
docker-compose up --build -d
```

3. Open the app:

- Frontend: http://localhost:3000
- Backend:  http://localhost:8080

Local development (WSL / Linux)
--------------------------------

The repository includes helper scripts for local development (WSL-friendly). From the project root:

```bash
# make scripts executable once
chmod +x scripts/*.sh

# One-time setup (installs local dependencies)
./scripts/dev-setup.sh

# Start all services (backend, frontend, DB, redis)
./scripts/dev-start.sh

# Check status
./scripts/dev-check.sh

# Stop services
./scripts/dev-stop.sh
```

Notes and troubleshooting
-------------------------

- **wkhtmltopdf**: used for PDF generation. The setup script will attempt to install
  it but platform/repository differences may require manual installation.
- If you see React hydration warnings in development when using browser extensions
  (password managers/login helpers), use the client-only wrapper or dynamic import
  for login UI components — the project already guards the login form to avoid
  hydration mismatches.
- Logs: `logs/backend.log` and `logs/frontend.log` are created by the dev scripts.

Project structure (top-level)
-----------------------------

```
invoice-generator-go/
├── invoice-generator-backend/   # Go backend service
├── invoice-generator-frontend/  # Next.js frontend
├── scripts/                     # Local dev helper scripts (dev-setup, dev-start, etc.)
├── docker-compose.yml           # Docker composition for the full stack
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

Further reading
---------------

- Local dev details: `DEV_README.md`
- Docker instructions: `README.docker.md` and `GETTING_STARTED.md`
- Script reference: `SCRIPTS_REFERENCE.md`

License
-------

See the `LICENSE` file in the repository root (if present) for licensing details.

Enjoy! If you want me to tailor this README further (add screenshots, badges,
or a short demo GIF), tell me what you'd like to include and I can add it.
