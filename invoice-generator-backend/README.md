# Invoice Generator Go

[![Go Report Card](https://goreportcard.com/badge/github.com/your-username/invoice-generator-go)](https://goreportcard.com/report/github.com/your-username/invoice-generator-go)
[![Build Status](https://github.com/your-username/invoice-generator-go/actions/workflows/go.yml/badge.svg)](https://github.com/your-username/invoice-generator-go/actions/workflows/go.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Streamline your invoicing process with Invoice Generator Go!** This powerful and flexible web application, built entirely in Go, empowers you to effortlessly create, manage, and deliver professional-looking invoices. Whether you're a freelancer, small business owner, or developer needing an invoicing solution, this project provides the tools you need.

## What Invoice Generator Go Offers:

- **Effortless Invoice Creation:** A user-friendly interface makes generating detailed invoices quick and simple. Spend less time on paperwork and more time on your business.
- **Professional PDF Generation:** Automatically generate polished, downloadable PDF invoices from your data using reliable `wkhtmltopdf` integration.
- **Template Customization:**
  - **Bring Your Own Design:** Upload and manage custom HTML templates to perfectly match your brand identity.
  - **Built-in Options:** Get started quickly with included basic, minimalistic, and modern templates.
  - **Personalization:** Easily add your company logo and custom background images to invoices.
- **Secure & Reliable:**
  - **User Authentication:** Protects your data and your clients' information with robust JWT-based authentication.
  - **Secure File Storage:** Ensures generated PDFs and uploaded assets are stored safely.
- **Developer Friendly:**
  - **API-First Design:** Built with a clean RESTful API, making it easy to integrate invoice generation into your existing applications or build custom frontends.
  - **Extensible:** Designed with clear separation of concerns, making it easier to add new features or modify existing ones. (e.g., Multi-Language Support and RBAC planned).
- **Responsive Design:** Access and manage your invoices seamlessly across desktops, tablets, and mobile devices.

## Tech Stack

- **Backend:** Go (Golang)
- **Web Framework:** Gin
- **Database:** PostgreSQL
- **Caching/Sessions:** Redis
- **PDF Generation:** `wkhtmltopdf`
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment (Optional):** NGINX, Docker

## Prerequisites

- **Go:** 1.18 or higher
- **PostgreSQL:** 12 or higher
- **Redis:** 6 or higher
- **`wkhtmltopdf`:** 0.12.6 or higher (must be in system `PATH`)
- **Docker & Docker Compose:** (Recommended for easy setup)

## Project Structure

```
invoice-generator-go/
├── api/          # API handlers, routes, middleware
├── cmd/          # Main application entry point (main.go)
├── config/       # Configuration loading
├── migrations/   # Database schema migrations
├── models/       # Data structures (Invoice, User, Template)
├── pdf/          # PDF generation logic
├── storage/      # Database interaction layer (PostgreSQL)
├── templates/    # Default HTML invoice templates
├── utils/        # Utility functions (auth, JWT, etc.)
├── .gitignore
├── docker-compose.yml # For local development environment
├── Dockerfile        # For building the application container
├── Dockerfile.migrate # For running migrations
├── go.mod
├── go.sum
├── init.sql      # Initial database setup script
├── README.md     # This file
└── scripts/      # Helper scripts (e.g., run-migrations.sh)
```

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/invoice-generator-go.git
    cd invoice-generator-go
    ```

2.  **Configure Environment Variables:**

    - Copy `invoice-generator-db/.env.example` to `invoice-generator-db/.env`.
    - Update the `.env` file with your PostgreSQL credentials.
    - Configure application settings (JWT secret, etc.) potentially via a `config.yaml` or environment variables directly (refer to `config/config.go`).

3.  **Run with Docker Compose (Recommended):**

    ```bash
    docker-compose up -d --build
    ```

    This will start the Go application, PostgreSQL database, and Redis. The database migrations will be applied automatically on startup.

4.  **Access the API:**
    The API should now be running (typically on `http://localhost:8080`, check your configuration). You can use tools like `curl` or Postman to interact with the endpoints defined in `api/routes.go`.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (assuming you add one).
