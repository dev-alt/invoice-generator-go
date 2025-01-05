package utils

import (
	"golang.org/x/crypto/bcrypt"
	"log"
)

const (
	// Keep the cost factor consistent
	bcryptCost = 14
)

func HashPassword(password string) (string, error) {
	// Explicitly set cost factor to ensure consistency
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		log.Printf("Password hashing error: %v", err)
		return "", err
	}
	log.Printf("Generated hash length: %d", len(bytes))
	return string(bytes), nil
}

func CheckPasswordHash(password, hash string) bool {
	// Log hash details for debugging
	log.Printf("Checking password hash - Hash length: %d", len(hash))

	// Verify the hash format
	if len(hash) < 60 {
		log.Printf("Warning: Hash length is shorter than expected bcrypt hash")
	}

	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		log.Printf("Password verification failed: %v", err)
		log.Printf("Hash prefix: %s", hash[:30]) // Show first part of hash for debugging
		return false
	}
	return true
}

// TestPasswordHashing Add a test function to verify hashing consistency
func TestPasswordHashing(password string) bool {
	// Generate a hash
	hash, err := HashPassword(password)
	if err != nil {
		log.Printf("Test hashing failed: %v", err)
		return false
	}

	// Verify the hash works
	if !CheckPasswordHash(password, hash) {
		log.Printf("Test verification failed for newly created hash")
		return false
	}

	log.Printf("Password hashing test succeeded")
	return true
}
