package config

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	PostgresURL     string `mapstructure:"POSTGRES_URL"`
	RedisURL        string `mapstructure:"REDIS_URL"`
	FileStoragePath string `mapstructure:"FILE_STORAGE_PATH"`
	JWTSecret       string `mapstructure:"JWT_SECRET"`
}

var AppConfig *Config

func LoadAppConfig() {
	viper.SetConfigName(".env") // Name of config file (without extension)
	viper.SetConfigType("env")  // The file type (env, yaml, json, etc.)
	viper.AddConfigPath(".")    // Look for config in the working directory

	// Read in the config file and handle errors
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file, %s", err)
	}

	// Unmarshal the config into the AppConfig struct
	err := viper.Unmarshal(&AppConfig)
	if err != nil {
		log.Fatalf("Unable to decode into struct, %v", err)
	}

	fmt.Println("Configuration loaded successfully")
}
