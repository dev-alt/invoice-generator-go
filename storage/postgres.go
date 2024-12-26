package storage

import (
	"database/sql"
	"fmt"
	"invoice-generator-go/config"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectPostgres() {
	var err error
	DB, err = sql.Open("postgres", config.AppConfig.PostgresURL)
	if err != nil {
		panic(err)
	}

	if err = DB.Ping(); err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to PostgreSQL!")
}
