# Security Features and Best Practices

This document outlines the security features implemented in the Invoice Generator API and provides guidance on maintaining a secure production environment.

## Table of Contents
- [Implemented Security Features](#implemented-security-features)
- [Authentication & Authorization](#authentication--authorization)
- [Input Validation & Sanitization](#input-validation--sanitization)
- [Rate Limiting](#rate-limiting)
- [Security Headers](#security-headers)
- [CORS Configuration](#cors-configuration)
- [Database Security](#database-security)
- [Production Deployment Checklist](#production-deployment-checklist)

## Implemented Security Features

### 1. Authentication & Authorization

**JWT-Based Authentication**
- JSON Web Tokens with 24-hour expiration
- HS256 signing algorithm
- User ID embedded in token claims
- Secure token validation middleware

**Password Security**
- Bcrypt hashing with cost factor of 14
- Password strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Maximum password length: 128 characters

**Implementation Files:**
- `utils/jwt.go` - JWT generation and validation
- `utils/auth.go` - Password hashing and verification
- `utils/validation.go` - Password strength validation
- `api/middleware.go` - Auth middleware

### 2. Input Validation & Sanitization

**Comprehensive Validation**
All user inputs are validated and sanitized before processing:

- **Email Validation**: RFC-compliant email format checking
- **Invoice Numbers**: Alphanumeric with hyphens/underscores only (max 50 chars)
- **Monetary Amounts**: Non-negative, maximum value validation
- **Tax Rates**: Range validation (0-100%)
- **String Lengths**: Min/max length enforcement
- **Currency Codes**: ISO 4217 validation (optional strict mode)
- **Status Values**: Whitelist validation for invoice statuses

**Auto-Sanitization**
- HTML/script tags removed from text inputs
- Whitespace trimming
- Length limiting
- Special character filtering

**Implementation Files:**
- `utils/validation.go` - All validation functions
- `api/users.go` - User input validation
- `api/invoices.go` - Invoice input validation

### 3. Rate Limiting

**Per-IP Rate Limiting**
Protects against brute force and denial-of-service attacks:

- **Strict Rate Limit (Auth endpoints)**: 5 requests per minute
  - Applied to `/api/register` and `/api/login`
  - Prevents credential stuffing attacks

- **General Rate Limit**: 100 requests per minute
  - Applied to all API endpoints globally
  - Prevents API abuse

**Features:**
- In-memory tracking with automatic cleanup
- Per-IP address tracking
- Sliding window implementation
- HTTP 429 (Too Many Requests) responses

**Implementation Files:**
- `api/rate_limiter.go` - Rate limiting middleware
- `api/routes.go` - Rate limit application to routes

### 4. Security Headers

**HTTP Security Headers**
All responses include security headers:

```
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Protection Against:**
- MIME type sniffing attacks
- Cross-site scripting (XSS)
- Clickjacking
- Man-in-the-middle attacks (when using HTTPS)

**Implementation Files:**
- `api/security.go` - Security headers middleware

### 5. CORS Configuration

**Configurable CORS**
- Environment-based allowed origins
- Credentials support
- Preflight request handling
- 24-hour preflight cache

**Configuration:**
Set the `CORS_ALLOWED_ORIGINS` environment variable:
```bash
# Development
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Production
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

**Implementation Files:**
- `api/security.go` - CORS middleware
- `cmd/main.go` - CORS configuration

### 6. Database Security

**Connection Pooling**
Optimized for performance and reliability:
- Max open connections: 25
- Max idle connections: 5
- Connection max lifetime: 5 minutes
- Connection max idle time: 2 minutes

**SQL Injection Prevention**
- Parameterized queries throughout
- No string concatenation in SQL
- Input validation before database operations

**Production Recommendations:**
- Enable SSL/TLS: `sslmode=require`
- Use strong database passwords
- Restrict database network access
- Regular security patches

**Implementation Files:**
- `storage/postgres.go` - Database connection with pooling
- `storage/*.go` - Parameterized queries

### 7. Additional Features

**Auto-Generated Invoice Numbers**
- Format: `INV-YYYYMMDD-XXXXXX`
- Collision-resistant using microsecond timestamps
- Prevents duplicate invoice numbers

**Error Message Security**
- Generic error messages for auth failures
- No information leakage about user existence
- Detailed errors logged server-side only

**Implementation Files:**
- `utils/invoice_number.go` - Invoice number generation

## Authentication & Authorization

### Obtaining a Token

**Register a new user:**
```bash
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "company_name": "My Company"
}
```

**Login:**
```bash
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using the Token

Include the token in the `Authorization` header:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

Tokens expire after 24 hours. Users must re-authenticate to obtain a new token.

## Rate Limiting

### Current Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/register` | 5 requests | 1 minute |
| `/api/login` | 5 requests | 1 minute |
| All other endpoints | 100 requests | 1 minute |

### Rate Limit Response

When rate limit is exceeded:
```json
HTTP/1.1 429 Too Many Requests

{
  "error": "Rate limit exceeded. Please try again later."
}
```

### Adjusting Rate Limits

Modify in `api/rate_limiter.go`:
```go
// For login/register
func StrictRateLimitMiddleware() gin.HandlerFunc {
    return RateLimitMiddleware(5, time.Minute)  // Adjust these values
}

// For general endpoints
func GeneralRateLimitMiddleware() gin.HandlerFunc {
    return RateLimitMiddleware(100, time.Minute)  // Adjust these values
}
```

## Production Deployment Checklist

### Pre-Deployment

- [ ] Generate strong JWT secret: `openssl rand -hex 32`
- [ ] Set `GIN_MODE=release`
- [ ] Configure production CORS origins
- [ ] Enable database SSL: `sslmode=require`
- [ ] Set strong database passwords
- [ ] Review and adjust rate limits
- [ ] Set up HTTPS/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Configure log rotation
- [ ] Set up database backups
- [ ] Test all authentication flows
- [ ] Test rate limiting
- [ ] Verify security headers
- [ ] Test error handling

### Environment Variables (Production)

```bash
# Required
POSTGRES_URL=postgresql://user:pass@host:5432/db?sslmode=require
JWT_SECRET=<strong-random-key>
GIN_MODE=release
CORS_ALLOWED_ORIGINS=https://your-domain.com

# Optional
API_PORT=8080
FILE_STORAGE_PATH=./storage/files
REDIS_URL=redis://localhost:6379
```

### Monitoring

**Key Metrics to Monitor:**
- Failed login attempts (potential brute force)
- Rate limit violations
- Database connection pool usage
- API response times
- Error rates by endpoint
- Token expiration/refresh rates

### Security Incident Response

1. **Suspected Breach:**
   - Immediately rotate JWT_SECRET
   - Invalidate all existing tokens
   - Review logs for suspicious activity
   - Check for unauthorized database access

2. **DDoS Attack:**
   - Review rate limit settings
   - Consider implementing additional WAF rules
   - Monitor server resources

3. **Data Breach:**
   - Notify affected users
   - Force password resets
   - Review and patch vulnerabilities
   - Document incident

## Best Practices

### For Developers

1. **Never commit secrets** to version control
2. **Always validate and sanitize** user input
3. **Use parameterized queries** for database operations
4. **Log security events** (failed logins, rate limit violations)
5. **Keep dependencies updated** regularly
6. **Test security features** in CI/CD pipeline
7. **Use HTTPS** in production always
8. **Implement proper error handling** without leaking information

### For Operators

1. **Rotate secrets** regularly (JWT secret, database passwords)
2. **Monitor logs** for suspicious activity
3. **Keep backups** encrypted and tested
4. **Apply security patches** promptly
5. **Use environment-specific configs** (dev/staging/prod)
6. **Implement least privilege** access
7. **Regular security audits**
8. **Document security procedures**

## Security Audit Recommendations

### Recommended Tools

- **Static Analysis**: `gosec` for Go security scanning
- **Dependency Scanning**: `govulncheck` for vulnerability detection
- **Load Testing**: Apache JMeter or k6 for rate limit testing
- **Penetration Testing**: OWASP ZAP or Burp Suite

### Regular Tasks

- Weekly dependency updates
- Monthly security reviews
- Quarterly penetration testing
- Annual third-party security audits

## Reporting Security Issues

If you discover a security vulnerability, please email security@yourdomain.com:

- Do not open public issues for security vulnerabilities
- Provide detailed information about the vulnerability
- Allow reasonable time for patching before disclosure
- We will acknowledge receipt within 48 hours

## Version History

- **v1.0.0** (2025-01-21): Initial security implementation
  - JWT authentication
  - Rate limiting
  - Input validation
  - Security headers
  - CORS configuration
  - Database connection pooling

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Go Security Best Practices](https://golang.org/doc/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
