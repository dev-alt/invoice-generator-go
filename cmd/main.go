package main

import (
	"invoice-generator-go/api"
	"invoice-generator-go/config"
	"invoice-generator-go/storage"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Try to load .env file but don't fail if it doesn't exist
	if err := godotenv.Load(); err != nil {
		log.Printf("Note: .env file not found, using environment variables")
	}

	// Load configuration
	appConfig := config.LoadAppConfig()

	// Connect to the database
	if err := storage.ConnectPostgres(appConfig.PostgresURL); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Set up Gin router
	r := gin.Default()

	// Setup API routes
	api.SetupRoutes(r)

	// Start the server
	log.Printf("Starting server on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
