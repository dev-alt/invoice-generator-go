package storage

import (
	"fmt"
	"invoice-generator-go/models"

	"github.com/google/uuid"
)

// CreateUser inserts a new user into the database.
func CreateUser(user *models.User) (string, error) {
	user.ID = uuid.New()
	query := `
        INSERT INTO users (id, email, password_hash, company_name, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `

	var id uuid.UUID
	err := DB.QueryRow(query, user.ID, user.Email, user.PasswordHash, user.CompanyName, user.CreatedAt, user.UpdatedAt).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("failed to insert user: %v", err)
	}

	return id.String(), nil
}

// GetUserByEmail retrieves a user by their email from the database.
func GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	query := `
        SELECT id, email, password_hash, company_name, created_at, updated_at
        FROM users
        WHERE email = $1
    `
	err := DB.QueryRow(query, email).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CompanyName, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by email: %v", err)
	}

	return &user, nil
}

// GetUserByID retrieves a user by their ID from the database.
func GetUserByID(userID uuid.UUID) (*models.User, error) {
	var user models.User
	query := `
        SELECT id, email, password_hash, company_name, created_at, updated_at
        FROM users
        WHERE id = $1
    `
	err := DB.QueryRow(query, userID).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CompanyName, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by ID: %v", err)
	}

	return &user, nil
}
