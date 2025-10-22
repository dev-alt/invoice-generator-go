package main

import (
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"invoice-generator-go/api"
	"invoice-generator-go/config"
	"invoice-generator-go/storage"
	"log"
)

func main() {
	// Try to load .env file but don't fail if it doesn't exist
	if err := godotenv.Load(); err != nil {
		log.Printf("Note: .env file not found, using environment variables")
	}

	// Load configuration
	appConfig := config.LoadAppConfig()

	// Set Gin mode based on environment
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Connect to the database with retry logic
	maxRetries := 3
	var err error
	for i := 0; i < maxRetries; i++ {
		err = storage.ConnectPostgres(appConfig.PostgresURL)
		if err == nil {
			break
		}
		log.Printf("Database connection attempt %d failed: %v", i+1, err)
		if i < maxRetries-1 {
			time.Sleep(time.Second * 2)
		}
	}
	if err != nil {
		log.Fatalf("Failed to connect to database after %d attempts: %v", maxRetries, err)
	}

	// Set up Gin router without default middleware
	r := gin.New()

	// Add custom recovery middleware
	r.Use(gin.Recovery())

	// Add security headers middleware
	r.Use(api.SecurityHeadersMiddleware())

	// Configure CORS with environment-based allowed origins
	allowedOrigins := getAllowedOrigins()
	r.Use(api.CORSMiddleware(allowedOrigins))

	// Add rate limiting
	r.Use(api.GeneralRateLimitMiddleware())

	// Add request logging
	r.Use(gin.Logger())

	// Setup API routes
	api.SetupRoutes(r)

	// Get port from environment or use default
	port := os.Getenv("API_PORT")
	if port == "" {
		port = "8080"
	}

	// Start the server
	log.Printf("Starting server on :%s", port)
	log.Printf("Environment: %s", gin.Mode())
	log.Printf("Allowed CORS origins: %v", allowedOrigins)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// getAllowedOrigins returns the list of allowed CORS origins
func getAllowedOrigins() []string {
	originsEnv := os.Getenv("CORS_ALLOWED_ORIGINS")
	if originsEnv == "" {
		// Default to localhost for development
		return []string{"http://localhost:3000", "http://localhost:3001"}
	}

	// Parse comma-separated list of origins
	origins := strings.Split(originsEnv, ",")
	for i, origin := range origins {
		origins[i] = strings.TrimSpace(origin)
	}

	return origins
}
