# Invoice Generator

[![Go Report Card](https://goreportcard.com/badge/github.com/your-username/invoice-generator-go)](https://goreportcard.com/report/github.com/your-username/invoice-generator-go)
[![Build Status](https://github.com/your-username/invoice-generator-go/actions/workflows/go.yml/badge.svg)](https://github.com/your-username/invoice-generator-go/actions/workflows/go.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Invoice Generator is a web application built in Go that allows users to create, manage, and generate professional invoices. It supports custom templates, PDF generation, multi-language options, and secure user authentication.

## Features

- **Invoice Creation:** Easily create invoices with a user-friendly interface.
- **Custom Templates:** Upload and manage custom invoice templates (HTML or LaTeX).
- **PDF Generation:** Generate downloadable PDF invoices using `wkhtmltopdf`.
- **Multi-Language Support:** (Coming Soon!) Generate invoices in multiple languages.
- **Logo and Background Customization:** Personalize invoices with your own logo and background.
- **Secure File Storage:** Store generated PDFs and user uploads securely.
- **User Authentication:** JWT-based authentication to protect user data.
- **Role-Based Access Control (RBAC):** (Coming Soon!) Define different user roles with specific permissions.
- **API-First Design:** Built with a RESTful API for easy integration with other applications.
- **Responsive Design:** Works seamlessly on desktops, tablets, and mobile devices.

## Tech Stack

- **Go:** Programming language used for the backend.
- **Gin:** Web framework for building the REST API.
- **PostgreSQL:** Relational database to store user data, invoices, and templates.
- **Redis:** In-memory data store for caching and session management.
- **`wkhtmltopdf`:** Command-line tool to convert HTML templates to PDF.
- **JWT:** JSON Web Tokens for secure authentication.
- **NGINX:** Reverse proxy and load balancer.

## Prerequisites

- **Go:** 1.18 or higher
- **PostgreSQL:** 12 or higher
- **Redis:** 6 or higher
- **`wkhtmltopdf`:** 0.12.6 or higher (make sure it's in your system's `PATH`)
- **NGINX:** (Optional, for deployment)
- **Node.js and npm:** (Optional, for frontend development if you have a separate frontend)

## Project Structure
invoice-generator-go/
├── api/ # API handlers, routes, middleware
├── config/ # Configuration loading
├── models/ # Data structures (Invoice, User, Template)
├── pdf/ # PDF generation logic
├── storage/ # Database interactions (PostgreSQL)
├── templates/ # Default invoice templates (HTML)
├── utils/ # Utility functions (hashing, JWT)
├── cmd/ # Main application entry point
│ └── main.go
├── web/ # (Optional) Frontend code (HTML, CSS, JavaScript)
├── .env.example # Example environment variables file
├── .gitignore # Files and folders to ignore in Git
├── go.mod # Go module definition
├── go.sum # Go module checksums
├── Dockerfile # (Optional) Dockerfile for containerization
├── docker-compose.yml # (Optional) Docker Compose for local development
└── README.md # This file
## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/invoice-generator-go.git
   cd invoice-generator-go
