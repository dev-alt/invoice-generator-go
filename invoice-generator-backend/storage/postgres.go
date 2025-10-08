package storage

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectPostgres(postgresURL string) error { // Now takes PostgresURL as argument and returns error
	// Load environment variables from .env file (optional)
	if err := godotenv.Load(); err != nil {
		log.Printf("Note: .env file not found, using environment variables")
	}

	var errDB error
	DB, errDB = sql.Open("postgres", postgresURL) // Use the passed in URL
	if errDB != nil {
		return fmt.Errorf("failed to open database connection: %v", errDB) // Return error
	}

	if errDB = DB.Ping(); errDB != nil {
		return fmt.Errorf("failed to ping database: %v", errDB) // Return error
	}

	fmt.Println("Successfully connected to PostgreSQL!")
	return nil // Return nil on success
}
