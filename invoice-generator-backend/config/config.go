package config

import (
	"os"
	"sync"
)

type AppConfig struct {
	PostgresURL     string
	RedisURL        string
	JWTSecret       string
	FileStoragePath string
}

var (
	appConfig  *AppConfig // Change this to a pointer
	configOnce sync.Once
)

func getEnvOrDefault(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return defaultValue
}

func LoadAppConfig() *AppConfig { // Return a pointer
	configOnce.Do(func() {
		appConfig = &AppConfig{ // Initialize the pointer
			PostgresURL:     getEnvOrDefault("POSTGRES_URL", "postgresql://invoice_user:password@localhost:5432/invoice_db?sslmode=disable"),
			RedisURL:        getEnvOrDefault("REDIS_URL", "redis://localhost:6379"),
			JWTSecret:       getEnvOrDefault("JWT_SECRET", "default-secret-key"),
			FileStoragePath: getEnvOrDefault("FILE_STORAGE_PATH", "./storage/files"),
		}
	})
	return appConfig
}

// GetConfig returns the current configuration
func GetConfig() *AppConfig { // Return a pointer
	configOnce.Do(func() {
		LoadAppConfig()
	})
	return appConfig
}
