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

	// Load environment variables from .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	// Load configuration
	config.LoadAppConfig()

	// Connect to the database
	storage.ConnectPostgres()

	// Set up Gin router
	r := gin.Default()

	// Setup API routes
	api.SetupRoutes(r)

	// Start the server
	r.Run(":8080")
}
