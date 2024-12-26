package storage

import (
	"invoice-generator-go/models"
)

func CreateUser(user models.User) (uint, error) {
	var id uint
	err := DB.QueryRow(`
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id
    `, user.Email, user.PasswordHash).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}

func GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := DB.QueryRow(`
        SELECT id, email, password_hash
        FROM users
        WHERE email = $1
    `, email).Scan(&user.ID, &user.Email, &user.PasswordHash)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
