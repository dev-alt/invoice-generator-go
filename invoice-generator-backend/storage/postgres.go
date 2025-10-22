package storage

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectPostgres(postgresURL string) error {
	// Load environment variables from .env file (optional)
	if err := godotenv.Load(); err != nil {
		log.Printf("Note: .env file not found, using environment variables")
	}

	var errDB error
	DB, errDB = sql.Open("postgres", postgresURL)
	if errDB != nil {
		return fmt.Errorf("failed to open database connection: %v", errDB)
	}

	// Configure connection pool for optimal performance and reliability
	DB.SetMaxOpenConns(25)                 // Maximum number of open connections
	DB.SetMaxIdleConns(5)                  // Maximum number of idle connections
	DB.SetConnMaxLifetime(5 * time.Minute) // Maximum lifetime of a connection
	DB.SetConnMaxIdleTime(2 * time.Minute) // Maximum idle time for a connection

	// Test the connection
	if errDB = DB.Ping(); errDB != nil {
		return fmt.Errorf("failed to ping database: %v", errDB)
	}

	log.Println("Successfully connected to PostgreSQL with connection pooling configured")
	log.Printf("Connection pool settings: MaxOpen=%d, MaxIdle=%d, MaxLifetime=%v, MaxIdleTime=%v",
		25, 5, 5*time.Minute, 2*time.Minute)

	return nil
}

// CloseDB closes the database connection gracefully
func CloseDB() error {
	if DB != nil {
		log.Println("Closing database connection...")
		return DB.Close()
	}
	return nil
}
